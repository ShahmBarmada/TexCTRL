import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "TexCTRL" },
    { name: "TexCTRL Mokhmal", content: "Welcome to TexCTRL" },
  ];
};

export default function HomePage() {
  return (
    <div className="h-full flex flex-col gap-y-4 justify-center items-center">
      <span className="text-7xl font-['Bungee']">TexCTRL</span>
      <div className="rounded-lg bg-slate-300 p-4 text-xl shadow-2xl">
        <Form method="post">
          <div className="flex flex-col gap-y-4">
            <input
              id="username"
              name="userame"
              type="text"
              placeholder="User Name"
              spellCheck="false"
              className="rounded-lg p-2 border-2 border-slate-400 outline-none focus:border-slate-700"
            />
            <input
              id="userpass"
              name="userpass"
              type="password"
              placeholder="Password"
              spellCheck="false"
              className="rounded-lg p-2 border-2 border-slate-400 outline-none focus:border-slate-700"
            />
            <div className="font-semibold flex justify-between items-center">
              <label
                htmlFor="remember"
                className="flex flex-nowrap items-center"
              >
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="accent-slate-700 w-5 h-5 mr-1"
                />
                Remember ?
              </label>
              <button
                type="submit"
                className="bg-slate-200 rounded-lg py-2 px-4 w-fit self-end hover:bg-slate-400"
              >
                Log in
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
