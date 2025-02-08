class WelcomeMessage {
  constructor(container) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-900 mb-2">
           Daily Cash Collection Report
        </h1>
        <p class="text-grey-600">
        
        
          Please log in to continue 
        </p>
      </div>
    `;
  }
}