import React, { useEffect, useState } from 'react'
import Todo from './Todo'
import Doing from './Doing'
import Done from './Done'

const TaskStatus = ({todo, fetch}) => {

    return (
        <div className='flex flex-col lg:flex-row gap-8 mb-16'>

            <div className='w-[300px] flex flex-col justify-start items-start '>
                <div className='border bg-red-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Todo</div>
                {/* {todo.length ? */}
                    <>
                        <Todo todo={todo} fetch={fetch}/>
                    </>
                    {/* : <></>
                } */}
            </div>

            <div className='w-[300px] flex flex-col justify-start items-start '>
                <div className='border bg-blue-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Doing</div>
                {/* {todo.length ? */}
                    <>
                        <Doing />
                    </>
                    {/* : <></>
                } */}
            </div>

            <div className='w-[300px] flex flex-col justify-start items-start '>
                <div className='border bg-green-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Done</div>
                {/* {todo.length ? */}
                    <>
                        <Done />
                    </>
                    {/* : <></>
                } */}
            </div>
        </div>
    )
}

export default TaskStatus