import React, { useState, useEffect } from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import toast, { Toaster } from 'react-hot-toast';
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag } from 'react-dnd';

const SetTodo = () => {
    const [task, setTask] = useState("")
    const [desc, setDesc] = useState("")
    const [pic, setPic] = useState("")
    const [status, setStatus] = useState("TODO")
    const [todo, setTodo] = useState([])
    const [doing, setDoing] = useState([])
    const [done, setDone] = useState([])
    const [updateID, setUpdateID] = useState("")
    const [UpdateBTN, setUpdateBTN] = useState(false)

    const FetchAllTasks = async () => {
        let result = await fetch('https://task-manager-api-mern.vercel.app/', {
            method: 'GET'
        })
        result = await result.json()
        if (result.data) {
            setTodo(result.data.filter((task) => {
                return task.status === "TODO"
            }))
            setDoing(result.data.filter((task) => {
                return task.status === "DOING"
            }))
            setDone(result.data.filter((task) => {
                return task.status === "DONE"
            }))
        }
    }

    useEffect(() => {
        FetchAllTasks()
    }, [])

    const createTask = async () => {
        try {
            if (task === "") {
                toast.error("Task must be filled!")
                return
            }
            if (desc === "") {
                toast.error("Description must be filled!")
                return
            }
            let result = await fetch('https://task-manager-api-mern.vercel.app/', {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ task, desc, pic, status: 'TODO' })
            })
            result = await result.json()
            console.log(result)
            setTask("")
            setDesc("")
            setPic("")
            FetchAllTasks()
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTask = async (id) => {
        try {
            let result = await fetch(`https://task-manager-api-mern.vercel.app/${id}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            result = await result.json()
            FetchAllTasks()
        } catch (error) {
            console.log(error)
        }
    }

    const updateTask = async (id, status) => {
        console.log(id)
        let result = await fetch(`https://task-manager-api-mern.vercel.app/${id}`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task, desc, pic, status })
        })
        result = await result.json()
        FetchAllTasks()
        cancelUpdate()
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    const enbleUpdate = ({ task, desc, pic, _id, status }) => {
        setTask(task)
        setDesc(desc)
        setPic(pic)
        setUpdateBTN(true)
        scrollToTop()
        setUpdateID(_id)
        setStatus(status)
    }
    const cancelUpdate = () => {
        setTask("")
        setDesc("")
        setPic("")
        setStatus("TODO")
        setUpdateBTN(false)
    }

    const Task = ({ listItem }) => {

        const [{ isDragging }, drag] = useDrag(() => ({
            type: "task",
            item: { listItem },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
        }))
        console.log(isDragging)
        return (
            <div ref={drag} className={`task flex flex-col justify-center items-start p-5 my-2 border rounded w-full shadow-md ${isDragging ? "text-gray-400" : ""}`}>
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
                <div className={`flex flex-row mt-4 justify-end items-end w-full text-xl gap-3 text-gray-600 ${isDragging ? "text-gray-400" : ""}`}>
                    <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800 cursor-pointer' onClick={() => enbleUpdate(listItem)}><AiFillEdit /></div>
                    <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800 cursor-pointer' onClick={() => deleteTask(listItem._id)}><AiFillDelete /></div>
                </div>
            </div>
        )
    }

    const Todo = () => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: "task",
            drop: async ({ listItem }) => {
                console.log("Dropped", listItem)
                if (listItem.status != "TODO") {
                    let result = await fetch(`https://task-manager-api-mern.vercel.app/${listItem._id}`, {
                        method: 'PATCH',
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ task: listItem.task, desc: listItem.desc, pic: listItem.pic, status: "TODO" })
                    })
                    result = await result.json()
                    FetchAllTasks()
                    toast.success("Task status is changed!")
                }
            }, collect: monitor => ({
                isOver: !!monitor.isOver(),
            }),
        }))
        return (
            <div ref={drop} className={`lg:w-[330px] w-[320px] pb-5 flex flex-col justify-start p-3 items-start ${isOver ? "bg-gray-100 rounded" : ""} `}>
                <div className='border bg-red-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Todo</div>
                <div className={`flex flex-col mt-5 w-full ${isOver ? "bg-gray-100" : ""} `}>
                    {
                        todo &&
                        todo.map((listItem, key) => {
                            return (
                                <Task key={key} listItem={listItem} />
                            )
                        })
                    }

                </div>
            </div>
        )
    }

    const Doing = () => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: "task",
            drop: async ({ listItem }) => {
                console.log("Dropped", listItem)
                if (listItem.status != "DOING") {
                    let result = await fetch(`https://task-manager-api-mern.vercel.app/${listItem._id}`, {
                        method: 'PATCH',
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ task: listItem.task, desc: listItem.desc, pic: listItem.pic, status: "DOING" })
                    })
                    result = await result.json()
                    FetchAllTasks()
                    toast.success("Task status is changed!")
                }
            }, collect: monitor => ({
                isOver: !!monitor.isOver(),
            }),
        }))
        return (
            <div ref={drop} className={`lg:w-[330px] w-[320px] pb-5 flex flex-col justify-start p-3 items-start ${isOver ? "bg-gray-100 rounded" : ""} `}>
                <div className='border bg-blue-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Doing</div>
                <div className={`flex flex-col mt-5 w-full ${isOver ? "bg-gray-100" : ""} `}>
                    {
                        doing &&
                        doing.map((listItem, key) => {
                            return (
                                <Task key={key} listItem={listItem} />
                            )
                        })
                    }

                </div>
            </div>
        )
    }

    const Done = () => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: "task",
            drop: async ({ listItem }) => {
                console.log("Dropped", listItem)
                if (listItem.status != "DONE") {
                    let result = await fetch(`https://task-manager-api-mern.vercel.app/${listItem._id}`, {
                        method: 'PATCH',
                        mode: 'cors',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ task: listItem.task, desc: listItem.desc, pic: listItem.pic, status: "DONE" })
                    })
                    result = await result.json()
                    FetchAllTasks()
                    toast.success("Task status is changed!")
                }
            }, collect: monitor => ({
                isOver: !!monitor.isOver(),
            }),
        }))
        return (
            <div ref={drop} className={`lg:w-[330px] w-[320px] pb-5 flex flex-col justify-start p-3 items-start ${isOver ? "bg-gray-100 rounded" : ""} `}>
                <div className='border bg-green-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Done</div>
                <div className={`flex flex-col mt-5 w-full ${isOver ? "bg-gray-100" : ""} `}>
                    {
                        done &&
                        done.map((listItem, key) => {
                            return (
                                <Task key={key} listItem={listItem} />
                            )
                        })
                    }

                </div>
            </div>
        )
    }



    return (
        <div>
            <Toaster />
            <div className='flex flex-col justify-start items-center  gap-2'>
                
                <div className='text-xl '>
                    <div className='text-lg font-semibold flex flex-row  '>Task<div className='text-red-400 pr-1'>*</div>:</div>
                    <input className='p-3 py-2  outline-gray-400 text-lg border rounded w-[300px] md:w-[550px] '
                        onChange={(e) => setTask(e.target.value)} value={task} placeholder='Enter your task' />
                </div>

                <div className='text-xl '>
                    <div className='text-lg font-semibold flex flex-row  '>Description<div className='text-red-400 pr-1'>*</div>:</div>
                    <textarea style={{ resize: 'none' }} className='p-3 py-2  outline-gray-400 text-lg border rounded md:w-[550px] w-[300px]'
                        onChange={(e) => setDesc(e.target.value)} value={desc} placeholder='Enter your description' />
                </div>
                <div className='text-xl '>
                    <div className='text-lg font-semibold flex flex-row  '>Pic URL : (If any)</div>
                    <input className='p-3 py-2  outline-gray-400 text-lg border rounded md:w-[550px] w-[300px]'
                        onChange={(e) => setPic(e.target.value)} value={pic} placeholder='Enter your pic url' />
                </div>

                <div className='flex md:flex-row flex-col gap-5 mt-3'>
                    {
                        UpdateBTN &&
                        <div className='p-3 border-[#F2BE22] hover:bg-[#f2b422] md:w-[268px] w-[300px] justify-center items-center text-center cursor-pointer font-semibold text-lg border rounded ' onClick={cancelUpdate}>Cancel</div>
                    }
                    {
                        UpdateBTN ?
                            <div className={`p-3 bg-[#F2BE22] hover:bg-[#f2b422] ${UpdateBTN ? 'md:w-[268px]' : 'md:w-[550px] '} w-[300px] justify-center items-center text-center cursor-pointer font-semibold text-lg border rounded `}
                                onClick={() => { if (updateID !== "") updateTask(updateID, status) }}>Update</div>
                            :
                            <div className={`p-3 bg-[#F2BE22] hover:bg-[#f2b422] ${UpdateBTN ? 'md:w-[268px]' : 'md:w-[550px] '} w-[300px] justify-center items-center text-center cursor-pointer font-semibold text-lg border rounded `}
                                onClick={createTask}>Create</div>
                    }
                </div>


            </div>
            <DndProvider backend={HTML5Backend}>
                <div className='mt-8 flex items-center justify-center mx-auto'>
                    <div className='flex flex-col lg:flex-row gap-3 mb-16'>

                        {/* TODO  */}
                        {/* <div className='w-[300px] flex flex-col justify-start items-start '>
                        <div className='border bg-red-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Todo</div>
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
                                                <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800' onClick={() => enbleUpdate(listItem)}><AiFillEdit /></div>
                                                <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800' onClick={() => deleteTask(listItem._id)}><AiFillDelete /></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div> */}
                        <Todo />

                        {/* DOING */}
                        {/* <div className='w-[300px] flex flex-col justify-start items-start '>
                        <div className='border bg-blue-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Doing</div>
                        <div className='flex flex-col mt-5 w-full'>
                            {
                                doing &&
                                doing.map((listItem, key) => {
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
                                                <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800' onClick={() => deleteTask(listItem._id)}><AiFillDelete /></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div> */}
                        <Doing />

                        {/* DONE  */}
                        {/* <div className='w-[300px] flex flex-col justify-start items-start '>
                        <div className='border bg-green-500 w-full text-center rounded py-3 text-[20px] font-semibold'>Done</div>
                        <div className='flex flex-col mt-5 w-full'>
                            {
                                done &&
                                done.map((listItem, key) => {
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
                                                <div className='p-2  rounded-full hover:bg-gray-200 hover:text-gray-800' onClick={() => deleteTask(listItem._id)}><AiFillDelete /></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div> */}
                        <Done />
                    </div>
                </div>
            </DndProvider>
        </div>
    )
}




export default SetTodo