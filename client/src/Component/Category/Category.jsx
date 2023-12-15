import React, { Fragment, useState, useEffect } from "react"
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import AddCategory from "./AddCategory";
import DeleteCategory from "./DeleteCategory";
import Editcategory from "./Editcategory.jsx";
import Pagination from "../Pagination/Index";
import VideoPopup from "./VideoPopup";
import CloseIcon from "../Svg/CloseIcon";
import ImagePopup from "./ImagePopup";

export const headItems = ["S. No.", "Category name", " Profile picture", "Video", "Action"]


const Category = () => {
  let [allData, setAllData] = useState([
    
  ])
  const token = JSON.parse(sessionStorage.getItem("sessionToken"))

  let [isOpen, setIsOpen] = useState(false)
  let [openEdit, setOpenEdit] = useState(false)
  let [openDelete, setOpenDelete] = useState(false)
  let [isLoader, setLoader] = useState(false)
  let [updateId, setUpdateId] = useState("")
  const [isRefresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState([]);
  const [video, setVideo] = useState("");
  let [openVideo, setOpenVideo] = useState(false)
  const [page, setPage] = useState(0)
  const visiblePageCount = 2
  const [viewImage, setViewImage] = useState("");
  let [openImage, setOpenImage] = useState(false)
  const [searchText, setSearchText] = useState("");
  // all data
  useEffect(() => {
    getAllData(1);
  }, [isRefresh]);

  const getAllData = (pageNo) => {
    setPage(pageNo)
    setLoader(true)
    const options = {
      method: "GET",
      url: `http://50.19.152.61:3000/api/auth/viewCategory?page=${pageNo}&limit=${visiblePageCount}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response?.data);
        if (response.status === 200) {
          setLoader(false)
          setAllData(response?.data);
        }
        else {
          setLoader(false)
          return
        }
      })
      .catch((error) => {
        setLoader(false)
        console.error("Error:", error);
      });
  };


  const closeModal = () => {
    setIsOpen(false)
  }

  const closeEditModal = () => {
    setOpenEdit(false)
  }

  const handleDelete = (id) => {
    setUpdateId(id)
    setOpenDelete(true)
  }

  // get by id 
  const handleEdit = (id) => {
    setUpdateId(1)
    try {
      setLoader(true)
      const options = {
        method: "GET",
        url: `/api/auth/getCategory/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      };
      axios
        .request(options)
        .then((response) => {
          console.log(response?.data);
          if (response.status === 200) {
            // console.log(response);
            setLoader(false)
            setEditData(response?.data);
            setOpenEdit(true)
          }
          else {
            setLoader(false)
            return
          }
        })
        .catch((error) => {
          setLoader(false)
          console.error("Error:", error);
        });
    }
    catch (e) {
      console.log(e)
    }
  }

  const closeDeleteModal = () => {
    setOpenDelete(false)
  }

  const refreshdata = () => {
    setRefresh(!isRefresh)
  }

  const handleVideo = (vid) => {
    setVideo(vid)
    setOpenVideo(true)
  }

  const closeVideoModal = () => {
    setOpenVideo(false)
  }

  const closeImageModal = () => {
    setOpenImage(false)
  }

  const handleImage = (imgUrl) => {
    setOpenImage(true)
    setViewImage(imgUrl)
  }

  const handleSearch = () => {
    if (searchText) {
      const options = {
        method: "GET",
        url: `/api/auth/viewCategory?search=${searchText}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      axios
        .request(options)
        .then((response) => {
          console.log(response?.data);
          if (response.status === 200) {
            setAllData(response?.data);
          }
          else {
            return
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  else{
    return ;
  }
  }

  const handleKeyDown = (e) => {
    console.log('Pressed key:', e.key);
    if (e.key === "backspace") {
      refreshdata()
    }
  }
  const handleClearSearch = () => {
    refreshdata()
    setSearchText("")
  }



  return (
    <>
      {
        isLoader && isLoader
      }
      <section>
        <div className="container mx-auto">
          <div className="rounded-[10px] bg-white py-[15px] flex justify-between items-center px-[20px]">
            <p className=" text-[22px] font-semibold">Category</p>
            <div className="flex gap-x-5 items-center">
              <div className="border border-[gray] rounded-[5px] bg-[#302f2f82]] flex justify-center items-center h-[32px] pl-[10px]">
                <input type="text " className=" focus-visible:outline-none border-none w-full rounded-[5px]  text-[15px]"
                value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {searchText !== "" ? 
                   <button className="px-1 rounded text-[12px] text-[gray] border border-[#6a696917] hover:text-black mr-1"
                   onClick={handleClearSearch}
                   > X  </button>
                    : "" }
                <button className="px-6 rounded text-[12px] text-[gray]  h-[32px] bg-[#6a696917] hover:text-black"
                onClick={handleSearch}
                >Search  </button>
              </div>
              <button className="custom-button" onClick={() => setIsOpen(true)}>Add new</button>
            </div>
          </div>
          <div className="rounded-[10px] bg-white py-[30px] px-[20px] flex justify-between items-center mt-[20px] p-6 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto mt-[20px] ">
              <thead className="">
                <tr className=" ">
                  {headItems.map((items, inx) => (
                    <th className="py-3 px-5 text-left bg-white" key={inx}>
                      <p className="block text-[13px] font-medium uppercase text-[#72727b]"> {items}</p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {  Array.isArray(allData?.category)&&
                  allData?.category?.length > 0 &&
                  allData?.category?.map((items, index) => (
                    <tr key={index}>
                      {/* {console.log(allData?.pagination?.currentPage)} */}
                      <td className="text-[14px] font-[400] py-3 px-5">{(index + 1) + (10*(allData?.pagination?.currentPage - 1))}</td>
                      <td className="text-[14px] font-[400] py-3 px-5">{items?.category}</td>
                      <td className="text-[14px] font-[400] py-3 px-5">
                        <div className="cursor-pointer" onClick={() => handleImage(items?.file)}>
                          <img src={items?.file} alt="fiteness" className="max-w-[100px]" />
                        </div>
                      </td>
                      <td className="text-[14px] font-[400] py-3 px-5 cursor-pointer text-[blue]">
                        {
                          Array.isArray(items.video) && items.video?.length > 0 && 
                          items.video.map((iter, inde)=>{
                            return(
                              <div className="" onClick={() => handleVideo(iter)}>{inde + 1} Video</div>

                            )
                          })
                        }
                      </td>
                      <td className="text-[14px] font-[400] py-3 px-5">
                        <div className="flex flex-col md:flex-row items-center gap-x-5">
                          <button className="px-4 text-[13px] border rounded h-[25px] text-[gray] hover:bg-[#80808045] hover:text-[black]"
                            onClick={() => handleEdit(items?._id)}
                          >Edit</button>
                          <button className="px-4 text-[13px] border rounded h-[25px] text-[red] hover:bg-[#efb3b38a]"
                            onClick={() => handleDelete(items?._id)}
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {
        allData?.pagination?.totalPages > 1 && (
          <Pagination
            currentpage={allData?.pagination?.currentPage}
            totalCount={allData?.pagination?.totalPages}
            visiblePageCount={visiblePageCount}
            getAllData={getAllData}
          />
        )
        }

     

      </section>


  {/*---------- Video popup---------- */}

  <Transition appear show={openVideo} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeVideoModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                <div
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-right absolute right-[15px] top-[15px] cursor-pointer"
                    onClick={closeVideoModal}
                  >
                    <CloseIcon />
                  </div>

                  <VideoPopup closeModal={closeVideoModal} refreshdata={refreshdata} data={video} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/*---------- Add popup---------- */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900"
                  >
                    Add new category
                  </Dialog.Title>
                  <AddCategory closeModal={closeModal} refreshdata={refreshdata} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


      {/*---------- Edit popup---------- */}

      <Transition appear show={openEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900"
                  >
                    Edit Category
                  </Dialog.Title>
                  <Editcategory closeModal={closeEditModal} refreshdata={refreshdata} editData={editData} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/*---------- Delete popup---------- */}

      <Transition appear show={openDelete} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900"
                  >
                    Delete category
                  </Dialog.Title>
                  <DeleteCategory closeModal={closeDeleteModal} refreshdata={refreshdata} deleteId={updateId} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
 {/*---------- Image popup---------- */}

 <Transition appear show={openImage} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeImageModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white py-10 px-12 text-left align-middle shadow-xl transition-all">
                  <div
                    className="xl:text-[20px] text-[18px] font-medium leading-6 text-gray-900 text-right absolute right-[15px] top-[15px] cursor-pointer"
                    onClick={closeImageModal}
                  >
                    <CloseIcon />
                  </div>
                  <ImagePopup closeModal={closeImageModal} refreshdata={refreshdata} imgUrl={viewImage} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    
    </>
  )
};

export default Category;
