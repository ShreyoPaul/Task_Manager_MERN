import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const Modal = ({ handleCancel, task }) => {
    const [desc, setDesc] = useState("")
    const [pic, setPic] = useState("")
    // console.log("task: ",task)
    const createTask = async (e) => {
        try {
            if (desc === '') {
                toast.error('Description must be filled!');
                return
            }
            let data = JSON.stringify({
                task, desc, pic, status: "TODO"
            })
            console.log(data)

            let result = await fetch('http://localhost:8001/', {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "applicatiion/json"
                },
                body: JSON.stringify({ name: "Shreyo Paul" })
            })
            result = await result.json()
            console.log(result)
            handleCancel()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

    }, [])
    return (
        <div>
            <Toaster />
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full justify-center sm:p-4 text-center items-center ">

                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-[300px]  sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5  sm:p-6 sm:pb-4">
                                <div className='text-2xl font-semibold mb-3'>{task}</div>
                                <div className=''>
                                    <div className='text-lg font-semibold flex flex-row'>Description<div className='text-red-400 pr-1'>*</div>:</div>
                                    <textarea style={{ resize: 'none' }} className='px-3 py-2 mt-1 outline-gray-100 text-md border rounded w-full'
                                        onChange={(e) => setDesc(e.target.value)} value={desc} placeholder='Enter yout task description' />
                                </div>
                                <div className=''>
                                    <div className='text-lg font-semibold'>Picture URL: (If any)</div>
                                    <input className='px-3 py-2 mt-1 outline-gray-100 text-md border rounded w-full '
                                        onChange={(e) => setPic(e.target.value)} value={pic} placeholder='Enter picture URL' />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                    onClick={createTask}>
                                    Create
                                </button>
                                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        // <>Modal</>
    )
}

export default Modal