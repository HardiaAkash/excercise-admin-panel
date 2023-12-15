import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddCategory = ({ closeModal }) => {

    const [formData, setFormData] = useState({
        category: '',
        file: '',
        video: [],
    });
    const token = JSON.parse(sessionStorage.getItem("sessionToken"))
    const [image, setImage] = useState("")
    const [video, setVideo] = useState("")
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageDisable, setImageDisable] = useState(false)
    const [videoDisable, setVideoDisable] = useState(false) 
    const InputHandler = (e) => {
        if (e.target.name === "file") {
            // console.log();
            setImage({ file: e.target.files[0] })
        }else if(e.target.name === "video"){
            setVideo({ file: e.target.files[0] })

        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const uploadImage = async (e) => {
        // alert("ssas")
        // toast.warn("Please select image.")
        // console.log(image);
        if (image == "" || image == undefined) {

            return toast.warn("Please select file.")
        }

        try {
            const response = await axios.post('api/auth/uploadImage', image, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // console.log('Category added:', response?.data);
                setFormData({ ...formData, ['file']: response?.data?.url })
                setImageDisable(true)
            }
            else {
                setFormData({ ...formData, ['file']: "" })
                setImageDisable(false)

            }
        } catch (error) {
            console.error('Error adding category:', error.response.data);
        }
    }
    const uploadVideo = async (e) => {
        // console.log(video);
        try {
            if (!video) {
                return toast.warn("Please select a file.");
            }
    
            const response = await axios.post('api/auth/uploadImage', video, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                // console.log('Video uploaded:', response?.data);
                const videoUrl = response?.data?.url;
                // formData.video.push(response?.data?.url)        
                setFormData({ ...formData, video: [...formData.video, videoUrl] });
                setVideoDisable(true);
            } else {
                // setFormData({ ...formData, video: "" });
                setVideoDisable(false);
            }
        } catch (error) {
            console.error('Error uploading video:', error.response?.data || error.message);
            // Handle the error: show a message or perform an action accordingly
        }
    };
    const addField = (e)=>{
        setVideoDisable(false)
        setVideo("")
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        
        setLoading(true)
        try {
            const response = await axios.post('/api/auth/addCategory', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // console.log('Login successful');
                toast.success("Category Created Successfully.")
                setLoading(false)
                closeModal()
            } else {
                // console.log(response);
                setError('Invalid credentials');
                toast.error(response)
                setLoading(false)
            }
        } catch (error) {
            console.error('Error during category:', error);
            setError("Login failed please try again!")
            toast.error("Something went wrong, try again later.")
            setLoading(false)
        }
    };

    return (
        <>
            <div className="">
                <form action="" className="" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center p-8  ">

                        <div className="py-3 ">
                            <span className="login-input-label">Category</span>
                            <input
                                type="text"
                                name="category"
                                pattern="^(?!\s)[a-zA-Z ]{1,}$"  
                                placeholder="Enter category name"
                                className="login-input w-full mt-2 "
                                onChange={InputHandler}
                                maxLength={64}
                                required />
                        </div>
                        <div className="py-2 flex items-end gap-x-10">
                            <div className="w-[50%]">
                                <span className="login-input-label cursor-pointer mb-2">Image</span>
                                <div className="flex items-center w-full">

                                    <input
                                        type="file"
                                        name="file"
                                        disabled={imageDisable}
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 "
                                        id="file"
                                        onChange={InputHandler}
                                        accept="image/png,image/jpg, image/jpeg , image/*"
                                    />


                                </div>
                            </div>
                            <div className="">
                                <button className="focus-visible:outline-none bg-[#070708bd] text-white text-[13px] px-4 py-1 rounded" type="button" onClick={uploadImage} disabled={imageDisable}>Upload</button>
                            </div>
                        </div>
                        <div className="py-2 flex  items-end gap-x-10">
                            <div className="w-[50%]">
                                <span className="login-input-label cursor-pointer mb-1">Video</span>
                                <div className="flex items-center  w-full">
                                    <input
                                        type="file"
                                        name="video"
                                        className="w-full"
                                        id="video"
                                        onChange={InputHandler}
                                        accept="video/mp4,video/x-m4v,video/*"
                                        disabled={videoDisable}
                                    />
                                </div>
                            </div>
                            <div className="">
                                {
                                  videoDisable? 
                                <button className="p-2 border h-[20px] flex justify-center items-center" type="button" onClick={addField}>+</button>:
                                <button className="focus-visible:outline-none bg-[#070708bd] text-white text-[13px] px-4 py-1 rounded" type="button" onClick={uploadVideo}>Upload</button>
                                }
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="custom-button"
                            >
                                Add
                            </button>
                        </div>

                    </div>
                </form>
            </div>

        </>
    )
};

export default AddCategory;