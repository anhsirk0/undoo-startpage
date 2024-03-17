let keys = [];
window.onload = main;
window.addEventListener("keydown", handleKeys);

const bookmarks = [
  {
    title: "Git",
    links: [
      { title: "Anhsirk0 - Codeberg", url: "https://codeberg.org/anhsirk0" },
      { title: "Anhsirk0", url: "https://github.com/anhsirk0" },
      { title: "Amn1729", url: "https://github.com/amn1729" },
    ],
  },
  {
    title: "Localhost",
    links: [
      { title: "3000", url: "http://localhost:3000" },
      { title: "4000", url: "http://localhost:4000" },
      { title: "5173", url: "http://localhost:5173" },
      { title: "8000", url: "http://localhost:8000" },
      { title: "8000/api", url: "http://localhost:8000/api" },
    ],
  },
  {
    title: "Repos",
    links: [
      {
        title: "tendrils-frontend",
        url: "https://github.com/anhsirk0/tendrils-frontend",
      },
      {
        title: "tendrils-backend",
        url: "https://github.com/anhsirk0/tendrils-backend",
      },
      {
        title: "fetch-master-6000",
        url: "https://codeberg.org/anhsirk0/fetch-master-6000",
      },
      { title: "gacp", url: "https://codeberg.org/anhsirk0/gacp" },
      {
        title: "awesome-config",
        url: "https://codeberg.org/anhsirk0/awesome-config",
      },
      {
        title: "shell-config",
        url: "https://codeberg.org/anhsirk0/shell-config",
      },
      {
        title: "kakoune-themes",
        url: "https://codeberg.org/anhsirk0/kakoune-themes",
      },
      {
        title: "alacritty-themes",
        url: "https://codeberg.org/anhsirk0/alacritty-themes",
      },
      {
        title: "wezterm-themes",
        url: "https://codeberg.org/anhsirk0/wezterm-themes",
      },
    ],
  },
  {
    title: "Other",
    links: [
      { title: "Lichess", url: "https://lichess.org" },
      { title: "Reddit", url: "https://reddit.com" },
      { title: "r/Unixporn", url: "https://reddit.com/r/unixporn" },
      { title: "Mail", url: "https://mail.yandex.com" },
      { title: "Monkeytype", url: "https://monkeytype.com" },
    ],
  },
];

const primaryBg = "bg-teal-400 dark:bg-slate-700";
const primaryBorder = "border-teal-400 dark:border-slate-700";
// const activeCls = "animate-bounce";
const activeCls = "-translate-x-8";

function main() {
  // window.focus();
  Bookmarks(...bookmarks.map(GroupCard));
}

function handleKeys(event) {
  if (event.key === "Escape" || (event.ctrlKey && event.key === "g")) {
    resetState();
    return event.preventDefault();
  }
  const elem = event.target;
  if (elem.getAttribute("id") === "search") return;

  if (event.key === "/") {
    event.preventDefault();
    const searchbox = document.getElementById("search");
    searchbox.focus();
    keys = [];
    return;
  }

  let idx = parseInt(event.key);
  if (!isNaN(idx)) {
    idx = idx || 9;
    if (keys.length === 0) {
      bookmarks.forEach((group, i) => {
        if (i === idx - 1) return;
        let grp = document.getElementById("group-" + i);
        grp.classList.add("opacity-25");
      });
    } else {
      try {
        let url = bookmarks[keys[0] - 1].links[idx - 1].url;
        // let link = document.getElementById("link-" + (idx - 1));
        let link = document.querySelector(
          `#group-${keys[0] - 1} #link-${idx - 1}`,
        );
        link.classList.add(activeCls);
        setTimeout(resetState, 200);
        window.location.href = url;
      } catch {
        resetState();
      }
    }
    keys.push(event.key);
  }
}

function resetState() {
  keys = [];
  document.getElementById("search").blur();
  document
    .querySelectorAll(".opacity-25")
    .forEach((el) => el.classList.remove("opacity-25"));
  document
    .querySelectorAll("." + activeCls)
    .forEach((el) => el.classList.remove(activeCls));
  window.focus();
}

function Bookmarks(...children) {
  const container = document.getElementById("bookmarks");
  children.forEach((child) => container.appendChild(child));
}

function GroupCard(group, idx) {
  const grpIdx = idx >= 9 ? 0 : idx + 1;
  return Div(
    {
      id: "group-" + idx,
      cls: `flex flex-1 flex-col gap-4 p-4 ${primaryBorder} border rounded-lg relative overflow-hidden`,
    },
    Div({ cls: `absolute inset-0 w-12 h-full ${primaryBg}` }),
    Div(
      {
        cls: "absolute left-0 w-12 text-center text-xl z-10 dark:text-slate-400",
      },
      grpIdx.toString(),
    ),
    P("text-semibold text-center text-xl", group.title),
    HR("h-px bg-slate-200 border-0 dark:bg-slate-700 w-4/6 self-center"),
    ...group.links.map((l, i) => Link(l, i, grpIdx)),
  );
}

function Link(link, idx, groupIdx) {
  return Div(
    { cls: "flex flex-row gap-32 w-full items-center" },
    Div(
      {
        cls: "absolute left-0 w-12 text-center text-lg z-10 dark:text-slate-400",
      },
      groupIdx + "." + (idx >= 9 ? 0 : idx + 1),
    ),
    Anchor(
      {
        id: "link-" + idx,
        cls: "ml-16 text-semibold text-lg z-10 hover:underline transition duration-300",
        href: link.url,
      },
      link.title,
    ),
  );
}

function Element(tag, props, ...children) {
  let element = document.createElement(tag);
  if (props.cls) element.classList.add(...props.cls.split(" "));

  delete props.cls;
  Object.keys(props).forEach((key) => {
    element[key] = props[key];
  });

  children.forEach((child) => {
    if (typeof child === "string") {
      element.innerHTML += child;
    } else element.appendChild(child);
  });
  return element;
}

function Div(props = {}, ...children) {
  return Element("div", props, ...children);
}

function HR(cls) {
  return Element("hr", { cls });
}

function P(cls, ...children) {
  return Element("p", { cls }, ...children);
}

function Anchor(props, ...children) {
  return Element("a", props, ...children);
}
