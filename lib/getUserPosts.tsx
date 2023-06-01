import React from 'react'

export default async function getUserPosts(userId: string) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, {cache: 'force-cache'})
    if(!res.ok) return undefined
    return res.json()

}

//ISR - incremental static revalidation
//fetch options: 
// { cache: 'force-cache'} --- always cache data
// { cache: 'no-store'} ---- alwasy use new data
// ISR - { next : { revalidate: 60}} - show data for 60 sec before revalidation to cehck if new data is present
