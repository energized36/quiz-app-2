      async function loadQuizzes() {
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("categoryId");

        if (!categoryId) {
          document.getElementById("quizzes-container").textContent = "No category selected.";
          return;
        }

        const quizzes = await fetch(`/categories/${categoryId}`).then(r => r.json());

        const container = document.getElementById("quizzes-container");
        quizzes.forEach(quiz => {
          const div = document.createElement("div");
          div.textContent = quiz.title;
          container.appendChild(div);
        });
      }

      loadQuizzes();