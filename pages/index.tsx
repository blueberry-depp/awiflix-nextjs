import {getSession} from "next-auth/react";
import {NextPageContext} from "next";
import Navbar from "@/components/Navbar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import useMovieList from "@/hooks/useMovieList";
import useFavorites from "@/hooks/useFavorites";
import InfoModal from "@/components/InfoModal";
import useInfoModal from "@/hooks/useInfoModal";


// protect the route
export async function getServerSideProps(context: NextPageContext) {
  // fetch session on the client side (we can't user server route)
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  }

  // we must return something if session is exists(in here empty object)
  return {
    props: {}
  }
}

export default function Home() {
  // load the movies
  // []: default is empty array
  const {data: movies = []} = useMovieList()
  const {data: favorites = []} = useFavorites()
  const {isOpen, closeModal} = useInfoModal()


  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal}/>
      <Navbar/>
      <Billboard/>
      <div className="pb-40">
        <MovieList data={movies} title="Trending Now"/>
        <MovieList data={favorites} title="My List"/>
      </div>
    </>
  )
}
