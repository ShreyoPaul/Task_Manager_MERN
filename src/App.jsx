import { useState, useEffect } from 'react'
import './App.css'
import SetTodo from './component/SetTodo'

function App() {
  const handleShow = () => {
    if (task !== "") setShowModal(true)
    else if (task === "") {
      toast.error('Task must be filled!');
      return
    }
  }

 

  return (
    <>
      <div className='w-full h-screen md:px-0 flex flex-col justify-start items-center'>
      <div className='text-4xl font-bold py-8'>Task Manager</div>
        <div className='flex items-start'>
          <SetTodo />
        </div>
        {/* <div className='mt-12 flex items-center justify-center mx-auto'>
          <TaskStatus todo={todo} doing={doing} done={done} />
        </div> */}
      </div>

    </>
  )
}

export default App
