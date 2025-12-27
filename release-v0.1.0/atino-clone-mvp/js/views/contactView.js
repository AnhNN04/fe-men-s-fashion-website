/**
 * Contact View Module - Contact form page
 */

/**
 * Render contact view
 */
export function render() {
  const contactSection = document.getElementById('contact-view');
  
  const html = `
    <div class="container">
      <div class="contact-wrapper">
        <section class="contact-hero">
          <h1>Liên Hệ Với Chúng Tôi</h1>
          <p class="lead">Chúng tôi rất muốn nghe từ bạn. Gửi cho chúng tôi một tin nhắn và chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
        </section>

        <section class="contact-content">
          <div class="contact-form-section">
            <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
            <form id="contactForm" class="contact-form">
              <div class="form-group">
                <label for="contactName">Tên của bạn *</label>
                <input 
                  type="text" 
                  id="contactName" 
                  name="name" 
                  required 
                  placeholder="Nhập tên của bạn"
                >
              </div>

              <div class="form-group">
                <label for="contactEmail">Email *</label>
                <input 
                  type="email" 
                  id="contactEmail" 
                  name="email" 
                  required 
                  placeholder="Nhập email của bạn"
                >
              </div>

              <div class="form-group">
                <label for="contactPhone">Số Điện Thoại</label>
                <input 
                  type="tel" 
                  id="contactPhone" 
                  name="phone" 
                  placeholder="Nhập số điện thoại của bạn"
                >
              </div>

              <div class="form-group">
                <label for="contactSubject">Chủ Đề *</label>
                <input 
                  type="text" 
                  id="contactSubject" 
                  name="subject" 
                  required 
                  placeholder="Chủ đề của tin nhắn"
                >
              </div>

              <div class="form-group">
                <label for="contactMessage">Tin Nhắn *</label>
                <textarea 
                  id="contactMessage" 
                  name="message" 
                  required 
                  rows="6"
                  placeholder="Nhập tin nhắn của bạn ở đây..."
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary" style="width: auto; align-self: flex-start;">
                Gửi Tin Nhắn
              </button>
            </form>
            <div id="contactFeedback" class="contact-feedback" style="display: none; margin-top: 20px;"></div>
          </div>

          <div class="contact-info-section">
            <h2>Thông Tin Liên Hệ</h2>
            
            <div class="contact-info">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Địa Chỉ
              </h3>
              <p>
                Urban Gent Fashion Store<br>
                123 Nguyễn Huệ, Quận 1<br>
                TP. Hồ Chí Minh, Việt Nam
              </p>
            </div>

            <div class="contact-info">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Điện Thoại
              </h3>
              <p>
                <a href="tel:+84912345678">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  +84 (91) 234-5678
                </a><br>
                <span style="color: #666;">Phục vụ: 8:00 - 22:00 hàng ngày</span>
              </p>
            </div>

            <div class="contact-info">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Email
              </h3>
              <p>
                <a href="mailto:support@urbangent.vn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  support@urbangent.vn
                </a><br>
                <a href="mailto:sales@urbangent.vn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  sales@urbangent.vn
                </a>
              </p>
            </div>

            <div class="contact-info">
              <h3>Mạng Xã Hội</h3>
              <div class="social-links">
                <a href="#" class="social-link" title="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a href="#" class="social-link" title="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="#" class="social-link" title="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                  <span>Twitter</span>
                </a>
                <a href="#" class="social-link" title="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                  <span>YouTube</span>
                </a>
              </div>
            </div>

            <div class="contact-info">
              <h3>Giờ Hoạt Động</h3>
              <ul style="list-style: none; padding: 0;">
                <li>Thứ Hai - Thứ Sáu: 8:00 - 22:00</li>
                <li>Thứ Bảy: 9:00 - 21:00</li>
                <li>Chủ Nhật: 10:00 - 20:00</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
  
  contactSection.innerHTML = html;
  
  // Setup form handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
  
  console.log('[ContactView] Rendered');
}

/**
 * Handle contact form submission
 * @param {Event} e - Form submit event
 */
function handleContactFormSubmit(e) {
  e.preventDefault();
  
  const form = e.currentTarget;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    timestamp: new Date().toISOString(),
  };
  
  // Save to localStorage for demo
  const messages = JSON.parse(localStorage.getItem('contact-messages') || '[]');
  messages.push(data);
  localStorage.setItem('contact-messages', JSON.stringify(messages));
  
  // Show success message
  const feedback = document.getElementById('contactFeedback');
  if (feedback) {
    feedback.style.display = 'block';
    feedback.style.color = '#28a745';
    feedback.style.padding = '15px';
    feedback.style.backgroundColor = '#f0fff4';
    feedback.style.borderRadius = '4px';
    feedback.innerHTML = `
      <strong>✓ Cảm ơn bạn!</strong><br>
      Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.
    `;
  }
  
  // Reset form
  form.reset();
  
  // Hide message after 5 seconds
  setTimeout(() => {
    if (feedback) {
      feedback.style.display = 'none';
    }
  }, 5000);
  
  console.log('[ContactView] Form submitted:', data);
}

export default {
  render,
};
