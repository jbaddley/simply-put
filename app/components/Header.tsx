"use client";
import Image from "next/image";
import logo from "../assets/SP.svg";
import { Navbar } from "flowbite-react";

const Header = () => {
  return (
    <Navbar>
      <Navbar.Brand href='/'>
        <Image src={logo} alt='Simply Put logo' height={96} />
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>Simply Put</span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href='/health-and-wellness'>Health & Wellness</Navbar.Link>
        <Navbar.Link href='/financial-health'>Financial Health</Navbar.Link>
        <Navbar.Link href='/music-and-movies'>Music and Movies</Navbar.Link>
        <Navbar.Link href='/gadgets-and-tech'>Gadgets and Tech</Navbar.Link>
        <Navbar.Link href='/family'>Family</Navbar.Link>
        <Navbar.Link href='/about'>About</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
