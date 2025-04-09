describe('Đặt lịch hẹn - Test Cases', () => {
  
    // TC-001: Không cho phép chọn ngày trong quá khứ
    it('TC-001 - Không thể đặt lịch vào ngày trong quá khứ', () => {
      cy.login(); // Đăng nhập trước
      cy.visit('/dat-lich');
      cy.get('#date').type('2024-12-01');
      cy.get('#time').select('08:00');
      cy.get('#submit').click();
      cy.contains('Không thể đặt lịch vào ngày trong quá khứ').should('be.visible');
    });
  
    // TC-002: Đặt lịch thành công với ngày hôm nay
    it('TC-002 - Đặt lịch thành công với ngày hôm nay', () => {
      const today = new Date().toISOString().split('T')[0];
      cy.login();
      cy.visit('/dat-lich');
      cy.get('#date').type(today);
      cy.get('#time').select('09:00');
      cy.get('#submit').click();
      cy.contains('Đặt lịch thành công').should('be.visible');
    });
  
    // TC-003: Không cho phép đặt vào ngày lễ
    it('TC-003 - Không thể đặt lịch vào ngày lễ', () => {
      cy.login();
      cy.visit('/dat-lich');
      cy.get('#date').type('2025-04-30');
      cy.get('#time').select('10:00');
      cy.get('#submit').click();
      cy.contains('Ngày lễ không thể đặt lịch').should('be.visible');
    });
  
    // TC-004: Không cho phép đặt vào giờ đã bị trùng
    it('TC-004 - Không thể đặt lịch vào giờ đã bị đặt trước', () => {
      cy.login();
      cy.visit('/dat-lich');
      
      // Giả sử giờ này đã đặt trước rồi
      cy.get('#date').type('2025-05-01');
      cy.get('#time').select('09:00');
      cy.get('#submit').click();
  
      cy.contains('Giờ này đã được đặt rồi').should('be.visible');
    });
  
    // TC-005: Đặt thành công với ngày và giờ hợp lệ
    it('TC-005 - Đặt lịch thành công với ngày và giờ hợp lệ', () => {
      cy.login();
      cy.visit('/dat-lich');
      cy.get('#date').type('2025-05-01');
      cy.get('#time').select('10:00');
      cy.get('#submit').click();
      cy.contains('Đặt lịch thành công').should('be.visible');
    });
  
    // TC-006: Không chọn ngày khi đặt lịch (người dùng chưa đăng nhập)
    it('TC-006 - Cảnh báo khi không chọn ngày', () => {
      cy.visit('/dat-lich');
      cy.get('#date').clear(); // đảm bảo trường ngày trống
      cy.get('#time').select('08:00');
      cy.get('#submit').click();
      cy.contains('Vui lòng chọn ngày').should('be.visible');
    });
  
    // TC-007: Không chọn giờ khi đặt lịch
    it('TC-007 - Cảnh báo khi không chọn giờ', () => {
      cy.login();
      cy.visit('/dat-lich');
      cy.get('#date').type('2025-05-01');
      cy.get('#time').select(''); // chọn giá trị rỗng
      cy.get('#submit').click();
      cy.contains('Vui lòng chọn giờ').should('be.visible');
    });
  
  });
  