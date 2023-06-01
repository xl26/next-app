import React, { use } from 'react'
import getUser from '@/lib/getUser';
import getUserPosts from '@/lib/getUserPosts';
import { Suspense } from 'react';
import UserPosts from './components/UserPosts';
import { Metadata } from 'next';
import getAllUsers from '@/lib/getAllUsers';
import { notFound } from 'next/navigation'
type Params = {
  params: {
    userId: string
  }
}

export async function generateMetadata({ params: { userId } }: Params): Promise<Metadata> {
  //deduplicated from below
  const userData: Promise<User> = getUser(userId);
  const user = await userData;
  if(!user)
  {
    return {
      title: "User Not Found!!"
    }
  }
  return {
    title: user.name,
    description: `This is the page of ${user.name}`
  }
}

export default async function UserPage({ params: { userId } }: Params) {
  //parallel calls
  const userData: Promise<User> = getUser(userId);
  const userPostsData: Promise<Post[]> = getUserPosts(userId);
  //below can be used and a valid approach but using suspense helps in showing data as it arrives from the parallel calls
  // const [user, userPosts] = await Promise.all([userData, userPostsData])
  
  //Recommendation :4
  const user = await userData;
  
  if(!user)
  {
    return notFound();
  }

  return (
    <>
      <h2>{user.name}</h2>
      <br />
      <Suspense fallback={<h2>Loading...</h2>}>
        {/* @ts-expect-error Async Server Component */}
        <UserPosts promise={userPostsData} />
      </Suspense>
    </>
  )
}

export async function generateStaticParams() {
  //deduplication from parent
  const usersData: Promise<User[]> = getAllUsers();
  const users = await usersData;
  return users.map(user => ({
    userId: user.id.toString()
  }))
}
