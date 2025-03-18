import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function Profile() {
  return (
    <div className="p-8 pt-20 min-h-screen flex justify-center items-center">     
    <UserProfile />
    </div>
  )
}

export default Profile