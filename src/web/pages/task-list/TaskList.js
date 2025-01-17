import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { customScrollbar, SIZE } from "constants/styles";

import { useScroll } from "hooks";

import { GoTop } from "components/go-top";
import { InfiniteScroll } from "components/infinite-scroll";
import { Error } from "components/error";
import { BlankState } from "components/blank-state";

import Media from "helpers/media";

import Loader from "assets/icons/loader.svg";

import { TaskCard, TaskListHeader } from "./components";
import { taskListConstants, taskListHooks } from "./duck";

const { useConnect } = taskListHooks;
const {
  TASK_LIST_HEADER_HEIGHT,
  TASK_LIST_HEADER_PADDING_TOP,
  TASK_LIST_MAX_WIDTH,
} = taskListConstants;

const Wrapper = styled.div`
  padding-top: ${TASK_LIST_HEADER_PADDING_TOP.primary}px;
  max-width: ${TASK_LIST_MAX_WIDTH}px;
  margin: 0 auto;
  height: 100%;
  overflow-y: hidden;

  ${Media.smallerThan.tabletLarge`
     padding-top: ${TASK_LIST_HEADER_PADDING_TOP.tablet}px;
     flex-direction: column;
     align-items: flex-start;
     justify-content: center;
  `}

  ${Media.smallerThan.mobileLarge`
     padding-top: ${TASK_LIST_HEADER_PADDING_TOP.mobile}px;
  `}
`;

const Table = styled.div`
  width: 100%;
  height: calc(
    100vh -
      ${SIZE.header +
      TASK_LIST_HEADER_HEIGHT.primary +
      TASK_LIST_HEADER_PADDING_TOP.primary}px
  );

  ${Media.smallerThan.tabletLarge`
     height: calc(
    100vh -
      ${
        SIZE.header +
        TASK_LIST_HEADER_HEIGHT.tablet +
        TASK_LIST_HEADER_PADDING_TOP.tablet
      }px
  );
  `};

  ${Media.smallerThan.mobileLarge`
     height: calc(
    100vh -
      ${
        SIZE.header +
        TASK_LIST_HEADER_HEIGHT.mobile +
        TASK_LIST_HEADER_PADDING_TOP.mobile
      }px
  );
  `}
`;

const Body = styled.div`
  padding: 40px 0;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  ${customScrollbar};

  ${Media.smallerThan.tabletLarge`
     padding: 20px 0;
  `}
`;

const TasksWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 22px;
`;

const TaskList = () => {
  const { isScroll, containerRefCallback, containerRef } = useScroll();
  const [searchText, setSearchText] = useState("");

  const {
    tasks,
    error,
    isLoadingTasks,
    loadTasks,
    clearTasks,
    isLoadedAllTasks,
  } = useConnect();

  const onLoadMore = useCallback(() => {
    loadTasks({
      search: searchText,
    });
  }, [searchText]);

  useEffect(() => {
    clearTasks();
    onLoadMore();
  }, [searchText]);

  return (
    <Wrapper>
      <Table>
        <TaskListHeader
          isDisabled={isLoadingTasks || Boolean(error)}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Body ref={containerRefCallback}>
          {error && (
            <Error>
              Something went wrong. <br /> Try again later.
            </Error>
          )}
          {!error &&
            (!tasks.length ? (
              <>
                {isLoadingTasks ? (
                  <Loader />
                ) : (
                  <BlankState>No tasks found</BlankState>
                )}
              </>
            ) : (
              <>
                <TasksWrapper>
                  {tasks.map(card => (
                    <TaskCard key={card.id} card={card} />
                  ))}
                </TasksWrapper>
                <InfiniteScroll
                  onLoadMore={onLoadMore}
                  isLoading={isLoadingTasks}
                  isNeedExecute={!isLoadedAllTasks}
                />
              </>
            ))}
        </Body>
      </Table>
      {isScroll && <GoTop containerRef={containerRef} />}
    </Wrapper>
  );
};

export default TaskList;
