const _ = (() => {
    const state = {
      tasks: [],
      dates: [],
      dom: {
        list: document.getElementById("list"),
        input: document.getElementById("in1")
      },
      config: {
        storageKeys: {
          tasks: "todo_list",
          dates: "todo_date"
        }
      }
    };

    const utils = {
      formatTime: (d) => `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`,
      sanitize: (str) => str.trim().replace(/(<([^>]+)>)/gi, ""),
      uid: () => Math.random().toString(36).substr(2, 9)
    };

    const storage = {
      get: (key) => JSON.parse(localStorage.getItem(key)) || [],
      set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
    };

    const render = {
      task: (task, date, id) => `
        <div class="div_text" data-id="${id}">
          <div class="text">
            ${task}
            <label>${date}</label>
            <button onclick="_.delete('${id}')">✕</button>
          </div>
        </div>
      `,
      all: () => {
        state.dom.list.innerHTML = state.tasks
          .map((task, i) => render.task(task, state.dates[i], i))
          .join("");
      }
    };

    const methods = {
      init: () => {
        state.tasks = storage.get(state.config.storageKeys.tasks);
        state.dates = storage.get(state.config.storageKeys.dates);
        render.all();
      },
      add: () => {
        const inputValue = state.dom.input.value.trim();
        if (!inputValue) return;

        const task = utils.sanitize(inputValue);
        state.tasks.push(task);
        state.dates.push(utils.formatTime(new Date()));

        storage.set(state.config.storageKeys.tasks, state.tasks);
        storage.set(state.config.storageKeys.dates, state.dates);

        state.dom.input.value = "";
        render.all();
      },
      delete: (id) => {
        state.tasks.splice(id, 1);
        state.dates.splice(id, 1);

        storage.set(state.config.storageKeys.tasks, state.tasks);
        storage.set(state.config.storageKeys.dates, state.dates);

        render.all();
      }
    };

    return methods;
  })();

  _.init();

  // این قسمت برای اینتر زدن روی همه دستگاه‌هاست (لپ‌تاپ و گوشی)
  document.getElementById("in1").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      _.add();
    }
  });
