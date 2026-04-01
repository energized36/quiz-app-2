class QuizzesPage {
    constructor() {
        // Read category context from the URL params set by categories.html
        const params = new URLSearchParams(window.location.search);
        this.categoryId = params.get("categoryId");
        this.categoryName = params.get("categoryName") ?? "";
        this.container = document.getElementById("quizzes-container");
    }

    // Fetch all quizzes for this category and render them
    async load() {
        if (!this.categoryId) {
            this.container.textContent = "No category selected.";
            return;
        }
        const quizzes = await fetch(`/categories/${this.categoryId}`).then(r => r.json());
        quizzes.forEach(quiz => this.renderQuiz(quiz));
    }

    // Create and append a link for a single quiz
    renderQuiz(quiz) {
        const link = document.createElement("a");
        link.textContent = quiz.title;
        link.href = `/quiz.html?quizId=${quiz.id}&quizTitle=${encodeURIComponent(quiz.title)}&categoryName=${encodeURIComponent(this.categoryName)}`;
        this.container.appendChild(link);
    }
}

new QuizzesPage().load();
