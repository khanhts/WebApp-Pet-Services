describe('📅 Appointment Booking Validation', () => {
    const validDate = '2025-04-10'; // ngày hợp lệ
    const pastDate = '2024-12-31'; // ngày quá khứ
    const holiday = '2025-04-30'; // ngày lễ
    const validHour = '09:00';
    const bookedHour = '10:00';
  
    beforeEach(() => {
      cy.visit('http://localhost:3000/' + validDate);
    });
  
    // ✅ Đặt lịch thành công với ngày và giờ hợp lệ
    it('✅ Đặt lịch thành công với ngày và giờ hợp lệ', () => {
      cy.get('input[name="ownerName"]').type('Lê Minh Đức');
      cy.get('input[name="pet"]').type('Mèo');
      cy.get('input[name="phone"]').type('0987654321123');
      cy.get('input[name="email"]').type('duc@example.com');
      cy.get('select[name="appointmentTime"]').select(validHour);
      cy.get('button[type="submit"]').click();
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('✅ Đặt lịch thành công!');
      });
    });
  
    // ❌ Không cho chọn ngày trong quá khứ
    it('❌ Cảnh báo khi chọn ngày trong quá khứ', () => {
      cy.get('input[name="appointmentDate"]').clear().type(pastDate).blur();
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('❌ Không thể đặt lịch vào ngày trong quá khứ!');
      });
    });
  
    // ❌ Không cho chọn ngày lễ hoặc ngày đã đầy
    it('❌ Cảnh báo khi chọn ngày bị khóa', () => {
      cy.get('input[name="appointmentDate"]').clear().type(holiday).blur();
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('❌ Ngày này là ngày lễ hoặc đã đầy lịch');
      });
    });
  
    // ❌ Cảnh báo khi chọn giờ đã bị đặt
    it('❌ Cảnh báo khi chọn giờ đã được đặt', () => {
      cy.intercept('GET', /booked-hours\?date=.*/, {
        body: [bookedHour]
      });
      cy.reload();
      cy.get('select[name="appointmentTime"]').select(bookedHour);
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains(`⚠️ Giờ ${bookedHour} đã được đặt`);
      });
    });
  
    // ✅ Không có alert nếu chọn giờ chưa được đặt
    it('✅ Cho phép chọn giờ còn trống', () => {
      cy.intercept('GET', /booked-hours\?date=.*/, {
        body: [bookedHour] // booked only 10:00
      });
      cy.reload();
      cy.get('select[name="appointmentTime"]').select('09:00');
      cy.on('window:alert', (txt) => {
        throw new Error('Không được có alert khi giờ chưa bị đặt');
      });
    });
  
    // ❌ Lỗi khi gửi dữ liệu (giả lập lỗi server)
    it('❌ Hiển thị lỗi khi submit gặp lỗi server', () => {
      cy.intercept('POST', '/appointments/add', {
        statusCode: 500,
        body: {}
      });
      cy.get('input[name="ownerName"]').type('Lê Minh Đức');
      cy.get('input[name="pet"]').type('Mèo');
      cy.get('input[name="phone"]').type('0987654321123');
      cy.get('input[name="email"]').type('duc@example.com');
      cy.get('select[name="appointmentTime"]').select(validHour);
      cy.get('button[type="submit"]').click();
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('❌ Đặt lịch thất bại!');
      });
    });
  
    // ✅ Form tự động set ngày nếu vào bằng link ?date
    it('✅ Form hiển thị đúng ngày khi có param ?date', () => {
      cy.get('input[name="appointmentDate"]').should('have.value', validDate);
    });
  });
  