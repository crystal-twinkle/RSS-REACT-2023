import React from 'react';
import Main from '../components/Main';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { wrapper } from '../store/store';
import { getAllCards, getRunningQueriesThunk } from '../services/pokemonAPI';
import { gSSP } from '../types/models';

export const getServerSideProps: GetServerSideProps<{ data: gSSP }> =
  wrapper.getServerSideProps((store) => async (context) => {
    const { limit, search, page } = context.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;
    const currentOffset = 1 + limitNumber * pageNumber;
    const searchString = search?.toString() || '';
    store.dispatch(
      getAllCards.initiate({
        limit: limitNumber,
        offset: currentOffset,
        query: searchString,
      })
    );

    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    return {
      props: {
        data: {
          cards: store.getState().pokemon,
        },
      },
    };
  });

const HomePage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { cards } = data;
  return (
    <>
      <Main cards={cards} />
    </>
  );
};
export default HomePage;
