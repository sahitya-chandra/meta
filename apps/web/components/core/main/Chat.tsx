import React, { ReactNode } from 'react'

export default function Chat({message}: { message: ReactNode}) {

  return (
    <div>
        {message}
    </div>
  )
}
