/**
 * About View Module - Company information page
 */

/**
 * Render about view
 */
export function render() {
  const aboutSection = document.getElementById('about-view');
  
  const html = `
    <div class="container">
      <div class="about-wrapper">
        <section class="about-hero">
          <h1>Về Urban Gent</h1>
          <p class="lead">Urban Gent là thương hiệu thời trang nam hàng đầu tại Việt Nam, chuyên cung cấp các sản phẩm chất lượng cao với giá cả phải chăng.</p>
        </section>

        <section class="about-content">
          <div class="about-section">
            <h2>Câu Chuyện Của Chúng Tôi</h2>
            <p>
              Urban Gent được thành lập vào năm 2015 với sứ mệnh mang thời trang nam chất lượng cao đến tay mọi người. 
              Chúng tôi tin rằng mỗi người đàn ông đều xứng đáng sở hữu những bộ quần áo tuyệt vời mà không cần phải 
              chi tiêu quá nhiều.
            </p>
            <p>
              Qua hơn 8 năm hoạt động, Urban Gent đã phục vụ hơn 100,000 khách hàng hài lòng trên toàn quốc. 
              Chúng tôi không ngừng nỗ lực để cải thiện chất lượng sản phẩm và dịch vụ khách hàng.
            </p>
          </div>

          <div class="about-section">
            <h2>Giá Trị Của Chúng Tôi</h2>
            <ul class="values-list">
              <li>
                <h4>Chất Lượng Cao</h4>
                <p>Tất cả sản phẩm của chúng tôi đều được kiểm tra chất lượng kỹ lưỡng.</p>
              </li>
              <li>
                <h4>Giá Cả Công Bằng</h4>
                <p>Chúng tôi cung cấp những sản phẩm tốt nhất với giá cả hợp lý.</p>
              </li>
              <li>
                <h4>Dịch Vụ Xuất Sắc</h4>
                <p>Khách hàng của chúng tôi luôn được ưu tiên hàng đầu.</p>
              </li>
              <li>
                <h4>Bền Vững</h4>
                <p>Chúng tôi cam kết hoạt động bền vững và bảo vệ môi trường.</p>
              </li>
            </ul>
          </div>

          <div class="about-section">
            <h2>Thống Kê</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>100,000+</h3>
                <p>Khách Hàng Hài Lòng</p>
              </div>
              <div class="stat-card">
                <h3>1,000+</h3>
                <p>Sản Phẩm Chính Hãng</p>
              </div>
              <div class="stat-card">
                <h3>50+</h3>
                <p>Thương Hiệu Nổi Tiếng</p>
              </div>
              <div class="stat-card">
                <h3>24/7</h3>
                <p>Hỗ Trợ Khách Hàng</p>
              </div>
            </div>
          </div>

          <div class="about-section">
            <h2>Đội Ngũ Của Chúng Tôi</h2>
            <p>
              Urban Gent được vận hành bởi đội ngũ những chuyên gia thời trang, quản lý chuỗi cung ứng, 
              và nhân viên dịch vụ khách hàng tận tâm, sẵn sàng phục vụ bạn.
            </p>
          </div>

          <div class="about-section about-cta">
            <h2>Bạn Có Câu Hỏi Gì Không?</h2>
            <p>Liên hệ với chúng tôi ngay hôm nay!</p>
            <a href="#/contact" class="btn btn-primary">Liên Hệ Chúng Tôi</a>
          </div>
        </section>
      </div>
    </div>
  `;
  
  aboutSection.innerHTML = html;
  console.log('[AboutView] Rendered');
}

export default {
  render,
};
