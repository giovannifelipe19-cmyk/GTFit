(function () {
      const root = document.getElementById("tejada-fit-widget");
      const storageKey = "tejada_fit_elementor_demo_v1";
      const titles = {
        home: ["Início", "Bom treino"],
        diet: ["Dieta", "Plano alimentar"],
        workout: ["Treino", "Execução correta"],
        profile: ["Perfil", "Dados do aluno"],
        admin: ["Admin", "Conteúdo do Tejada"]
      };
      const defaultData = {
        users: [{ full_name: "Tejada Admin", email: "admin@tejada.fit", password: "admin123", role: "admin" }],
        current: null,
        posts: [
          { title: "Suba a carga só com execução limpa", body: "Se a última repetição perder amplitude, mantém a carga e melhora o controle.", date: "Hoje" },
          { title: "Nova opção de refeição 3", body: "Incluída substituição com arroz, frango e legumes para dias de agenda corrida.", date: "Ontem" },
          { title: "Fotos de evolução até domingo", body: "Envie frente, lado e costas com a mesma luz para comparar melhor.", date: "Sábado" }
        ],
        meals: [
          { id: 1, name: "Refeição 1", time: "07:00", items: "4 ovos, 80g de aveia, 1 banana e café sem açúcar", photo: "" },
          { id: 2, name: "Refeição 2", time: "10:30", items: "160g de frango, 150g de arroz e salada verde", photo: "" },
          { id: 3, name: "Pré-treino", time: "14:30", items: "120g de patinho, 180g de batata e 1 fruta", photo: "" },
          { id: 4, name: "Pós-treino", time: "17:00", items: "Whey, 1 banana e 40g de cereal de arroz", photo: "" }
        ],
        workouts: {
          A: { title: "Peito, ombro e tríceps", exercises: [
            { id: 1, name: "Supino inclinado", meta: "4 séries · 8 a 10 reps · 90s", video: "" },
            { id: 2, name: "Supino reto com halteres", meta: "3 séries · 10 reps · 75s", video: "" },
            { id: 3, name: "Crucifixo na máquina", meta: "3 séries · 12 reps · 60s", video: "" }
          ]},
          B: { title: "Costas e bíceps", exercises: [
            { id: 4, name: "Puxada alta", meta: "4 séries · 8 a 10 reps · 90s", video: "" },
            { id: 5, name: "Remada curvada", meta: "4 séries · 8 reps · 90s", video: "" }
          ]},
          C: { title: "Pernas completo", exercises: [
            { id: 6, name: "Agachamento livre", meta: "4 séries · 6 a 8 reps · 120s", video: "" },
            { id: 7, name: "Leg press", meta: "4 séries · 10 reps · 90s", video: "" }
          ]},
          D: { title: "Posterior e abdômen", exercises: [
            { id: 8, name: "Stiff", meta: "4 séries · 8 a 10 reps · 90s", video: "" },
            { id: 9, name: "Prancha", meta: "4 séries · 45s · 45s", video: "" }
          ]}
        },
        activeDay: "A"
      };
      let data = load();

      function load() {
        try { return JSON.parse(localStorage.getItem(storageKey)) || structuredClone(defaultData); }
        catch { return structuredClone(defaultData); }
      }

      function save() {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }

      function $(selector) { return root.querySelector(selector); }
      function $all(selector) { return Array.from(root.querySelectorAll(selector)); }
      function escapeHTML(text) {
        return String(text || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
      }
      function initials(name) {
        return String(name || "TF").trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
      }

      function currentUser() {
        return data.users.find(user => user.email === data.current);
      }

      function setTab(tab) {
        $all("[data-tab]").forEach(button => button.classList.toggle("tfw-active", button.dataset.tab === tab));
        $all("[data-panel]").forEach(panel => panel.classList.toggle("tfw-active", panel.dataset.panel === tab));
        $("[data-title]").textContent = titles[tab][0];
        $("[data-kicker]").textContent = titles[tab][1];
      }

      function renderUser() {
        const user = currentUser();
        if (!user) {
          root.classList.add("tfw-locked");
          root.classList.remove("tfw-admin");
          return;
        }
        root.classList.remove("tfw-locked");
        root.classList.toggle("tfw-admin", user.role === "admin");
        $all("[data-name]").forEach(el => el.textContent = user.full_name);
        $all("[data-initials]").forEach(el => el.textContent = initials(user.full_name));
        $all("[data-subtitle]").forEach(el => el.textContent = user.role === "admin" ? "Administrador · Tejada" : "Aluno · Plano ativo");
      }

      function renderFeed() {
        $("[data-feed]").innerHTML = data.posts.map((post, index) => `
          <article class="tfw-card tfw-feed">
            <div class="tfw-media ${index % 3 === 1 ? "green" : index % 3 === 2 ? "red" : ""}"></div>
            <div>
              <span>${escapeHTML(post.date || "Agora")}</span>
              <h4>${escapeHTML(post.title)}</h4>
              <p>${escapeHTML(post.body)}</p>
            </div>
          </article>
        `).join("");
      }

      function renderMeals() {
        $("[data-meals]").innerHTML = data.meals.map(meal => `
          <article class="tfw-card tfw-meal">
            <div>
              <strong>${escapeHTML(meal.name)}</strong>
              <span>${escapeHTML(meal.time)}</span>
              <p>${escapeHTML(meal.items)}</p>
            </div>
            <div class="tfw-photo">
              <input id="tfw-meal-${meal.id}" type="file" accept="image/*" data-meal-photo="${meal.id}">
              ${meal.photo ? `<div class="tfw-preview"><img alt="Foto da refeição" src="${meal.photo}"></div>` : `<label for="tfw-meal-${meal.id}" aria-label="Anexar foto"><svg viewBox="0 0 24 24"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"></path><circle cx="12" cy="13" r="3"></circle></svg></label>`}
            </div>
          </article>
        `).join("");
      }

      function allExercises() {
        return Object.entries(data.workouts).flatMap(([day, workout]) => workout.exercises.map(ex => ({ ...ex, day })));
      }

      function renderWorkout() {
        const workout = data.workouts[data.activeDay];
        $("[data-workout-label]").textContent = "Treino " + data.activeDay;
        $("[data-workout-title]").textContent = workout.title;
        $("[data-exercises]").innerHTML = workout.exercises.map((exercise, index) => `
          <button class="tfw-card tfw-exercise" type="button" data-open-video="${exercise.id}">
            <span class="tfw-number">${index + 1}</span>
            <span><strong>${escapeHTML(exercise.name)}</strong><span class="tfw-meta">${escapeHTML(exercise.meta)}</span></span>
            <span class="tfw-play"><svg viewBox="0 0 24 24"><polygon points="9 7 18 12 9 17 9 7"></polygon></svg></span>
          </button>
        `).join("");
        $("[data-video-select]").innerHTML = allExercises().map(ex => `<option value="${ex.id}">Treino ${ex.day} - ${escapeHTML(ex.name)}</option>`).join("");
      }

      function renderAll() {
        renderUser();
        renderFeed();
        renderMeals();
        renderWorkout();
        save();
      }

      $all("[data-auth]").forEach(button => {
        button.addEventListener("click", () => {
          $all("[data-auth]").forEach(item => item.classList.remove("tfw-active"));
          $all("[data-form]").forEach(item => item.classList.remove("tfw-active"));
          button.classList.add("tfw-active");
          $(`[data-form="${button.dataset.auth}"]`).classList.add("tfw-active");
          $("[data-message]").textContent = "";
        });
      });

      $('[data-form="login"]').addEventListener("submit", event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const email = String(form.get("email") || "").trim().toLowerCase();
        const user = data.users.find(item => item.email === email && item.password === form.get("password"));
        if (!user) {
          $("[data-message]").textContent = "Email ou senha inválidos.";
          return;
        }
        data.current = user.email;
        renderAll();
      });

      $('[data-form="register"]').addEventListener("submit", event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const email = String(form.get("email") || "").trim().toLowerCase();
        if (data.users.some(user => user.email === email)) {
          $("[data-message]").textContent = "Esse email já está cadastrado neste navegador.";
          return;
        }
        data.users.push({ full_name: form.get("full_name"), email, password: form.get("password"), role: "student" });
        data.current = email;
        renderAll();
      });

      $all("[data-tab]").forEach(button => button.addEventListener("click", () => setTab(button.dataset.tab)));
      $all("[data-jump]").forEach(button => button.addEventListener("click", () => setTab(button.dataset.jump)));
      $all("[data-day]").forEach(button => {
        button.addEventListener("click", () => {
          $all("[data-day]").forEach(item => item.classList.remove("tfw-active"));
          button.classList.add("tfw-active");
          data.activeDay = button.dataset.day;
          renderWorkout();
          save();
        });
      });

      $("[data-meals]").addEventListener("change", event => {
        const input = event.target.closest("[data-meal-photo]");
        if (!input || !input.files || !input.files[0]) return;
        const reader = new FileReader();
        reader.onload = () => {
          const meal = data.meals.find(item => String(item.id) === input.dataset.mealPhoto);
          meal.photo = reader.result;
          renderMeals();
          save();
        };
        reader.readAsDataURL(input.files[0]);
      });

      $("[data-exercises]").addEventListener("click", event => {
        const button = event.target.closest("[data-open-video]");
        if (!button) return;
        const exercise = allExercises().find(item => String(item.id) === button.dataset.openVideo);
        $("[data-modal-title]").textContent = exercise.name;
        $("[data-modal-copy]").textContent = exercise.video ? "Vídeo anexado pelo admin para este exercício." : "O admin ainda não anexou vídeo para este exercício.";
        $("[data-video-box]").innerHTML = exercise.video
          ? `<video controls src="${escapeHTML(exercise.video)}"></video>`
          : `<svg viewBox="0 0 24 24"><polygon points="9 7 18 12 9 17 9 7"></polygon></svg>`;
        $("[data-modal]").classList.add("tfw-open");
      });

      $("[data-close]").addEventListener("click", () => $("[data-modal]").classList.remove("tfw-open"));
      $("[data-modal]").addEventListener("click", event => {
        if (event.target.matches("[data-modal]")) event.currentTarget.classList.remove("tfw-open");
      });

      $("[data-finish]").addEventListener("click", event => {
        event.currentTarget.textContent = "Concluído";
        event.currentTarget.style.background = "var(--tf-green)";
      });

      $("[data-logout]").addEventListener("click", () => {
        data.current = null;
        save();
        renderUser();
        setTab("home");
      });

      $('[data-admin-form="feed"]').addEventListener("submit", event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        data.posts.unshift({ title: form.get("title"), body: form.get("body"), date: "Agora" });
        event.currentTarget.reset();
        $("[data-admin-message]").textContent = "Post publicado.";
        renderAll();
      });

      $('[data-admin-form="meal"]').addEventListener("submit", event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        data.meals.push({ id: Date.now(), name: form.get("name"), time: form.get("time"), items: form.get("items"), photo: "" });
        event.currentTarget.reset();
        $("[data-admin-message]").textContent = "Refeição salva.";
        renderAll();
      });

      $('[data-admin-form="exercise"]').addEventListener("submit", event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        data.workouts[form.get("day")].exercises.push({ id: Date.now(), name: form.get("name"), meta: form.get("meta"), video: form.get("video") || "" });
        event.currentTarget.reset();
        $("[data-admin-message]").textContent = "Exercício salvo.";
        renderAll();
      });

      $('[data-admin-form="video"]').addEventListener("submit", event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const exercise = allExercises().find(item => String(item.id) === String(form.get("exercise")));
        const original = data.workouts[exercise.day].exercises.find(item => item.id === exercise.id);
        original.video = form.get("video");
        event.currentTarget.reset();
        $("[data-admin-message]").textContent = "Vídeo anexado.";
        renderAll();
      });

      renderAll();
    })();
