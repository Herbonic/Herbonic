// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelectorAll('.cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartContent = document.getElementById('cart-content');
const clearCartBtn = document.getElementById('clear-cart');

// Slider Functionality (only for index.html)
function initializeSlider() {
  if (document.querySelector('.slider')) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;

    function changeSlide(direction) {
      currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
      updateSlider();
    }

    function setSlide(index) {
      currentSlide = index;
      updateSlider();
    }

    function updateSlider() {
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
      });
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
      });
      document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Auto-slide every 5 seconds
    setInterval(() => changeSlide(1), 5000);

    // Event listeners for slider controls
    document.querySelector('.prev-btn')?.addEventListener('click', () => changeSlide(-1));
    document.querySelector('.next-btn')?.addEventListener('click', () => changeSlide(1));
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => setSlide(index));
    });
  }
}

// Update Price Display on Quantity Selection
function updatePrice(select) {
  const priceElement = select.parentElement.querySelector('.price');
  const selectedOption = select.options[select.selectedIndex];
  const price = selectedOption.getAttribute('data-price');
  priceElement.textContent = `₨${price}`;
}

// Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    let card = button.closest('.product-card') || button.closest('.product-content');
    if (!card) return; // Exit if no valid card is found

    const select = card.querySelector('.quantity-select');
    const selectedOption = select.options[select.selectedIndex];
    const product = {
      id: card.dataset.id,
      name: card.dataset.name,
      quantity: selectedOption.value, // e.g., "30g"
      price: parseFloat(selectedOption.getAttribute('data-price')),
      count: 1
    };

    const existingItem = cart.find(item => item.id === product.id && item.quantity === product.quantity);
    if (existingItem) {
      existingItem.count++;
    } else {
      cart.push(product);
    }

    updateCart();
  });
});

function updateCart() {
  if (cartItems && cartTotal && cartEmpty && cartContent) {
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
      cartContent.style.display = 'none';
    } else {
      cartEmpty.style.display = 'none';
      cartContent.style.display = 'block';

      cart.forEach((item, index) => {
        total += item.price * item.count;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.name} (${item.quantity})</td>
          <td>₨${item.price.toFixed(0)}</td>
          <td>
            <div class="quantity-control">
              <button class="quantity-btn" onclick="changeQuantity(${index}, -1)" aria-label="Decrease quantity">-</button>
              <input type="number" class="quantity-input" value="${item.count}" min="1" onchange="updateQuantity(${index}, this.value)">
              <button class="quantity-btn" onclick="changeQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
            </div>
          </td>
          <td>₨${(item.price * item.count).toFixed(0)}</td>
          <td><button class="remove-btn" onclick="removeItem(${index})" aria-label="Remove ${item.name} from cart">Remove</button></td>
        `;
        cartItems.appendChild(tr);
      });
    }

    cartTotal.textContent = total.toFixed(0);
  }

  // Update cart count on all pages
  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
  cartCount.forEach(count => {
    count.textContent = totalCount;
  });

  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

function changeQuantity(index, delta) {
  cart[index].count = Math.max(1, cart[index].count + delta);
  updateCart();
}

function updateQuantity(index, value) {
  const count = parseInt(value);
  if (count >= 1) {
    cart[index].count = count;
    updateCart();
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// Clear Cart
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCart();
  });
}

// Form Validation and WhatsApp Checkout (only for index.html)
function initializeForm() {
  const form = document.getElementById('user-details-form');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (form && checkoutBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const address = document.getElementById('address');
      const contact = document.getElementById('contact');

      let isValid = true;

      // Validate Name
      if (!name.value.trim()) {
        name.parentElement.classList.add('invalid');
        isValid = false;
      } else {
        name.parentElement.classList.remove('invalid');
        name.parentElement.classList.add('valid');
      }

      // Validate Address
      if (!address.value.trim()) {
        address.parentElement.classList.add('invalid');
        isValid = false;
      } else {
        address.parentElement.classList.remove('invalid');
        address.parentElement.classList.add('valid');
      }

      // Validate Contact
      const contactRegex = /^[0-9]{10,12}$/;
      if (!contactRegex.test(contact.value)) {
        contact.parentElement.classList.add('invalid');
        isValid = false;
      } else {
        contact.parentElement.classList.remove('invalid');
        contact.parentElement.classList.add('valid');
      }

      if (isValid && cart.length > 0) {
        checkoutBtn.classList.add('loading');
        let message = `Order Details:\nName: ${name.value}\nAddress: ${address.value}\nContact: ${contact.value}\n\nItems:\n`;
        cart.forEach(item => {
          message += `${item.name} (${item.quantity}) x${item.count} - ₨${(item.price * item.count).toFixed(0)}\n`;
        });
        message += `\nTotal: ₨${cartTotal.textContent}`;

        setTimeout(() => {
          const whatsappUrl = `https://wa.me/+923325207977?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          checkoutBtn.classList.remove('loading');
        }, 1000); // Simulate loading for 1 second
      } else if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
      }
    });

    // Real-time Input Validation
    ['name', 'address', 'contact'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          if (id === 'contact') {
            const contactRegex = /^[0-9]{10,12}$/;
            if (contactRegex.test(input.value)) {
              input.parentElement.classList.remove('invalid');
              input.parentElement.classList.add('valid');
            } else {
              input.parentElement.classList.add('invalid');
              input.parentElement.classList.remove('valid');
            }
          } else {
            if (input.value.trim()) {
              input.parentElement.classList.remove('invalid');
              input.parentElement.classList.add('valid');
            } else {
              input.parentElement.classList.add('invalid');
              input.parentElement.classList.remove('valid');
            }
          }
        });
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeSlider();
  initializeForm();
  updateCart(); // Update cart count on all pages
});

