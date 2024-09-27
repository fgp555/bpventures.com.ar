import Link from "next/link";

export default function SecurityButton() {
  return (
    <Link href="./security">
      <div className="grid grid-cols-6 px-4 items-center ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-8 col-start-2 hover:scale-125 md:hover:scale-100 md:col-start-1 md:size-6 text-secundary"
        >
          <title>seguridad</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
        <h1 className="text-xs text-secundary hidden md:block font-futura cursor-pointer col-span-3">
          SEGURIDAD
        </h1>
      </div>
    </Link>
  );
}
