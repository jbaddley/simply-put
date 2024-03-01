"use client";

import { Footer } from "flowbite-react";
import dayjs from "dayjs";
export default function DefaultFooter() {
  return (
    <Footer container>
      <Footer.Copyright by='SimplyPut' href='/' year={dayjs().year()} />
      <Footer.LinkGroup>
        <Footer.Link href='/business-mindset-unleashed'>Business Mindset Unleased</Footer.Link>
        <Footer.Link href='/affiliate-marketing'>Affiliate Marketing</Footer.Link>
        <Footer.Link href='/lead-generation'>Lead Generation</Footer.Link>
        <Footer.Link href='/contact-us'>Contact Us</Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
}
