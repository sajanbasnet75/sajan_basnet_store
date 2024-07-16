document.addEventListener('DOMContentLoaded', function () {
  function fetchCartItems(){
    return fetch('/cart.js')
      .then((response) => response.json())
      .then((cart) => {
        return cart.items;
      });
  }

  function fetchRecommendations(productId){
    return fetch(`/recommendations/products?product_id=${productId}&limit=4&section_id=product-recommendations&intent=complementary`)
      .then(response => response.text())
      .then((text) => {
        const html = document.createElement('div');
        html.innerHTML = text;
        const recommendations = html.querySelector('#product-recommendations');
        return recommendations ? recommendations.innerHTML : '';
      });
  }

  async function displayCartRecommendations(){
    try {
      const cartItems = await fetchCartItems();
      if (cartItems.length > 0) {
        debugger
        const productRecommendationsSection = document.querySelector('.cart-recommendations-response');
        let allRecommendationsHTML = '';

        for (const item of cartItems) {
          const recommendationsHTML = await fetchRecommendations(item.product_id);
          allRecommendationsHTML += recommendationsHTML;
        }

        if (allRecommendationsHTML.trim().length){
          productRecommendationsSection.innerHTML = allRecommendationsHTML;
        }else{
          productRecommendationsSection.innerHTML = '';
        }
      }
    }catch(error){
      console.log('error fetching recommendations:', error)
    }
  }
  displayCartRecommendations();
});
