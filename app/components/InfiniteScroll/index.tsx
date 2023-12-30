import { useIntersection } from '@/app/hooks/useIntersection'
import Image from 'next/image'
import { useEffect, useRef, useState, MutableRefObject } from "react"

// getUsers
const URL = 'https://randomuser.me/api/'

export const getUsers = (currentPage: number) => {
  return fetch(`${URL}?results=10&seed=ivangcode&page=${currentPage}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error getting users response')
      }
      return response.json()
    })
    .then((data) => data.results)
    .catch(err => err)
    .finally()
}

// useUsers
export function useUsers () {
  const [users, setUsers] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)


  useEffect(() => {
    getUsers(1)
      .then((data) => setUsers(prev => ([...prev, ...data])))
  },[currentPage])
  return {users, setCurrentPage, currentPage}
}

// Componen view
export function InfiniteScroll () {
  const {users, setCurrentPage, currentPage} = useUsers()
  const lastItemRef = useRef<HTMLDivElement>(null)
  const entry = useIntersection(lastItemRef, {
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setCurrentPage(prev => prev + 1)
    }
  }, [entry, setCurrentPage]);

  return (
    <div className='flex flex-col gap-2 justify-center items-center border-red-100'>
    {users.map((user: any, index) => (
      <div className='w-[300px]' key={user.uuid}>
        {user.email}
        <Image width={45} height={45} src={user.picture.thumbnail} alt={user.email} />
      </div>
    ))}
    <div ref={lastItemRef}></div>
    </div>
  )

}