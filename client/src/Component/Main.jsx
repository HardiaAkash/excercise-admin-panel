import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.svg"
import Dashboard from "./Dashboard";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import User  from "./User/Index";
import Category from "./Category/Category";
import DashboardIcon from "./Svg/Dashboard";
import UserIcon from "./Svg/UserIcon";
import CategoryIcon from "./Svg/CategoryIcon";
import { SignoutIcon } from "./Svg/SignoutIcon";

export const menus = [
    {
        id: 0,
        label: "Dashboard",
        component: <Dashboard />,
        icon: <DashboardIcon />
    },
    {
        id: 1,
        label: "User",
        component: <User />,
        icon: <UserIcon />,
    },
    {
        id: 2,
        label: "Category",
        component: <Category />,
        icon: <CategoryIcon />,
    },
]

const SideMenu = () => {
    const [ComponentId, setComponentId] = useState(0);
    const [token, setToken] = useState(JSON.parse(sessionStorage.getItem("sessionToken")))
    // console.log(token);
    const navigate = useNavigate()
useEffect(() => {
    verify()
}, [token])

const verify = async () => {
    try {
      const res = await axios.get(`/api/auth/verifyToken/${token}`);
    //   console.log(res);
      if (res.status === 200) {
        return; // Do whatever you need after successful verification
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Something went wrong.")
      navigate("/");
      // Handle the error, maybe navigate somewhere or show an error message
    }
  };
    const handleClick = (id) => {
        setComponentId(id)
    }
    const handleSignout = () => {
        sessionStorage.removeItem("sessionToken")
        navigate("/")
    }


    return (
        <section className="">
            <div className="flex h-[100vh]">
                <div className="w-[20%] bg-[#181824] text-white flex flex-col justify-between py-[40px] px-[20px]" >
                    <div className="">
                        <div className="text-[22px] font-semibold    text-white">
                            {/* <img src={logo} alt="fittness" /> */}
                            Admin Dashboard
                        </div>
                        <div className="flex flex-col 2xl:gap-8 gap-5 pt-[100px]">
                            {menus.map((item, index) => (
                                <div key={index}
                                    className={`border-b border-[#ffffff1c] px-2 py-3 cursor-pointer flex items-center gap-x-3 dash-menu
                                    ${item.id ===  ComponentId ? "dash-active" : ""}  `}
                                    onClick={() => handleClick(item.id)} >

                                    {item?.icon}
                                    <p className="2xl:text-[18px] text-[16px] font-medium ">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="">
                        <p className="" onClick={handleSignout}>Sign out</p>
                    </div>
                </div>
                <div className="w-[80%] bg-[#f3f3f3]">

                    {menus.map((item, index) => (
                        <>
                            {
                                ComponentId === item.id &&
                                item.component
                            }
                        </>
                    ))}

                </div>
            </div>
        </section>
        
    )
};

export default SideMenu;
