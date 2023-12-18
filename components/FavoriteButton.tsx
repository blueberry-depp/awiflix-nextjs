import React, {useCallback, useMemo} from "react";
import {AiOutlineCheck, AiOutlinePlus} from "react-icons/ai";
import useFavorites from "@/hooks/useFavorites";
import useCurrentUser from "@/hooks/useCurrentUser";
import axios from "axios";

interface FavoriteButtonProps {
  movieId: string
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({movieId}) => {
  const {mutate: mutateFavorites} = useFavorites()
  const {data: currentUser, mutate} = useCurrentUser()

  // create a check variable to see if a movie is favorited or not
  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || []
    // we gonna search in our current user in their favoriteIds and we're going to see if the current list includes the pass in movieId
    return list.includes(movieId)
  }, [currentUser, movieId])

  const toggleFavorites = useCallback(async () => {
    let response

    // once we click the favorites we're going to check if the current movie is favorited, if it is we're going to trigger the delete axios request but so if we want to add it to favorites
    if (isFavorite) {
      response = await axios.delete('/api/favorite', {data: {movieId}})
      // if it is not favorite
    } else {
      // since this is a post method we don't have to add this explicit 'data' right here, we have to do this for the delete request
      response = await axios.post('/api/favorite', {movieId})
    }

    const updatedFavoriteIds = response?.data?.favoriteIds

    mutate({
      // we're gonna spread the currentUser and the only field we want to mutate is favoriteIds
      ...currentUser,
      favoriteIds: updatedFavoriteIds
    })

    mutateFavorites()
  }, [movieId, isFavorite, currentUser, mutate, mutateFavorites])

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus

  return (
    <div
      onClick={toggleFavorites}
      className="cursor-pointer group-item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
      <Icon className="text-white" size={25}/>


    </div>
  )

}

export default FavoriteButton
