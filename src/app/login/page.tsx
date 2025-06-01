"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login/new");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <br></br>
      <div>
        <form action="POST" className="bg-[#b2acff] p-6 rounded-lg shadow-md">
          <br></br>
          <p>Username/Email: </p>
          <input type="text" className="rounded-lg shadow-md" />
          <p>Password: </p>
          <input type="password" className="rounded-lg shadow-md" />
          <br></br>
          <br></br>
          <button
            className="bg-[#b3adff] p-3 rounded-lg shadow-md"
            onClick={handleClick}
          >
            Login
          </button>
        </form>
        <div>
          <a href="/forgot">Forgot password/email</a>
          <br></br>
          <a href="/signup">Sign up</a>
        </div>
      </div>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
