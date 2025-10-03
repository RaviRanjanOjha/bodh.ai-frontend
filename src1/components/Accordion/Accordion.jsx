import React from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';

export default function AccordionCustomStyles() {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion
        open={open === 1}
        className="mb-2 rounded-lg border border-blue-gray-100 px-4"
      >
        <AccordionHeader
          onClick={() => handleOpen(1)}
          className={`border-b-0 transition-colors ${
            open === 1 ? 'text-blue-500 hover:!text-blue-700' : ''
          }`}
        >
          Favorites
        </AccordionHeader>
        <AccordionBody className="pt-0 text-base font-normal">
          {/* We&apos;re not always in the position that we want to be at.
          We&apos;re constantly growing. We&apos;re constantly making mistakes.
          We&apos;re constantly trying to express ourselves and actualize our
          dreams. */}
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === 2}
        className="mb-2 rounded-lg border border-blue-gray-100 px-4"
      >
        <AccordionHeader
          onClick={() => handleOpen(2)}
          className={`border-b-0 transition-colors ${
            open === 2 ? 'text-blue-500 hover:!text-blue-700' : ''
          }`}
        >
          Today
        </AccordionHeader>
        <AccordionBody className="pt-0 text-base font-normal">
          {/* We&apos;re not always in the position that we want to be at.
          We&apos;re constantly growing. We&apos;re constantly making mistakes.
          We&apos;re constantly trying to express ourselves and actualize our
          dreams. */}
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === 3}
        className="rounded-lg border border-blue-gray-100 px-4"
      >
        <AccordionHeader
          onClick={() => handleOpen(3)}
          className={`border-b-0 transition-colors ${
            open === 3 ? 'text-blue-500 hover:!text-blue-700' : ''
          }`}
        >
          Yesterday
        </AccordionHeader>
        <AccordionBody className="pt-0 text-base font-normal">
          {/* We&apos;re not always in the position that we want to be at.
          We&apos;re constantly growing. We&apos;re constantly making mistakes.
          We&apos;re constantly trying to express ourselves and actualize our
          dreams. */}
        </AccordionBody>
      </Accordion>
      <Accordion
        open={open === 4}
        className="rounded-lg border border-blue-gray-100 px-4"
      >
        <AccordionHeader
          onClick={() => handleOpen(4)}
          className={`border-b-0 transition-colors ${
            open === 4 ? 'text-blue-500 hover:!text-blue-700' : ''
          }`}
        >
          Last 30 Days
        </AccordionHeader>
        <AccordionBody className="pt-0 text-base font-normal">
          {/* We&apos;re not always in the position that we want to be at.
          We&apos;re constantly growing. We&apos;re constantly making mistakes.
          We&apos;re constantly trying to express ourselves and actualize our
          dreams. */}
        </AccordionBody>
      </Accordion>
    </>
  );
}
