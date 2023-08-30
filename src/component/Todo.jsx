import React, { useEffect, useState } from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'

const Todo = ({ todo, fetch, deleteTask }) => {
    console.log("TODO: ", todo)
    // const [todo, setTodo] = useState([])


    const FetchAllTasks = async () => {
        let result = await fetch('http://localhost:8001/', {
            method: 'GET'
        })
        result = await result.json()
        if (result.data) {
            setTodo(result.data.filter((task) => {
                return task.status === "TODO"
            }))
        }
    }

    


    return (

        <div className='flex flex-col mt-5 w-full'>
            {
                todo &&
                todo.map((listItem, key) => {
                    return (
                        <div key={key} className='flex flex-col justify-center items-start p-5 my-2 border rounded w-full shadow-md'>
                            <div className='text-[20px] font-semibold'>
                                {listItem.task}
                            </div>
                            <hr className='flex flex-col justify-center items-start border-[0.9px] w-full my-2' />
                            <div>
                                {listItem.desc}
                            </div>
                            {
                                listItem.pic &&
                                <div className='w-full rounded mt-5'>
                                    <img src={listItem.pic} alt='pic' className='w-full rounded' />
                                </div>
                            }
                            <div className='flex flex-row justify-end items-end w-full text-xl gap-3 text-gray-600'>
                                <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800'><AiFillEdit /></div>
                                <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800' onClick={deleteTask()}><AiFillDelete /></div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default Todo