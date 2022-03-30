import React, { useCallback, useEffect } from "react";
import styled from "styled-components";

import { customScrollbar, SIZE } from "constants/styles";

import { useScroll } from "hooks";

import { GoTop, InfiniteScroll } from "components";

import Loader from "assets/icons/loader.svg";

import { TaskCard, TaskListHeader } from "./components";
import { taskListConstants, taskListHooks } from "./ducks";

const { useConnect } = taskListHooks;
const {
  TASK_LIST_HEADER_HEIGHT,
  TASK_LIST_HEADER_PADDING_TOP,
  TASK_LIST_MAX_WIDTH,
} = taskListConstants;

const Wrapper = styled.div`
  padding-top: ${TASK_LIST_HEADER_PADDING_TOP}px;
  max-width: ${TASK_LIST_MAX_WIDTH}px;
  margin: 0 auto;
  height: 100%;
  overflow-y: hidden;
`;

const Table = styled.div`
  width: 100%;
  height: calc(
    100vh -
      ${SIZE.header + TASK_LIST_HEADER_HEIGHT + TASK_LIST_HEADER_PADDING_TOP}px
  );
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
`;

const TasksWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 22px;
`;

const Error = styled.div``;

const TaskList = () => {
  const { isScroll, containerRefCallback, containerRef } = useScroll();
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
      search: "",
    });
  }, []);

  useEffect(() => {
    clearTasks();
    onLoadMore();
  }, []);

  return (
    <Wrapper>
      <Table>
        <TaskListHeader isDisabled={isLoadingTasks} />
        <Body ref={containerRefCallback}>
          {error && <Error>Something went wrong. Try again later.</Error>}
          {!error &&
            (!tasks.length ? (
              <>{isLoadingTasks ? <Loader /> : "Task list is empty"}</>
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
