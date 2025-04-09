describe('🧪 Black Box Testing - Đặt lịch', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Thay bằng đường dẫn thực tế của bạn
    });
  
    it('❌ Cảnh báo khi chọn ngày trong quá khứ', () => {
        cy.get("table").first().within(() => {
            cy.get('td[data-date="2025-04-08"]').click();
        });
        cy.on('window:alert', (txt) => {
        expect(txt).to.contains('❌ Không thể đặt lịch vào ngày trong quá khứ!');
        });
    });
  
    it('✅ Đặt lịch thành công với ngày và giờ hợp lệ', () => {
        // Click vào ngày cụ thể trên FullCalendar
        cy.get("table").first().within(() => {
          cy.get('td[data-date="2025-04-20"]').click();
        });
        // Điền thông tin form
        cy.get('input[name="ownerName"]').type('Lê Minh Đức');
        cy.get('input[name="pet"]').type('Mèo');
        cy.get('input[name="phone"]').type('0123456789');
        cy.get('input[name="email"]').type('duc@example.com');
        cy.get('select[name="appointmentTime"]').select('08:00');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (txt) => {
              expect(txt).to.contains('✅ Đặt lịch thành công!');
            });
      });
  
        // ❌ Không cho chọn ngày lễ hoặc ngày đã đầy
        it('❌ Cảnh báo khi chọn ngày bị khóa', () => {
            cy.get("table").first().within(() => {
                cy.get('td[data-date="2025-04-10"]').click();
            });
            cy.on('window:alert', (txt) => {
            expect(txt).to.contains('❌ Ngày này là ngày lễ hoặc đã đầy lịch');
            });
        });
  
    it('❌ Không cho đặt vào giờ đã bị trùng lịch', () => {
      cy.get("table").first().within(() => {
        cy.get('td[data-date="2025-05-01"]').click();
      });
  
      cy.get('input[name="ownerName"]').type('Nguyễn Văn C');
      cy.get('input[name="pet"]').type('Chim');
      cy.get('input[name="phone"]').type('0987654321');
      cy.get('input[name="email"]').type('chim@example.com');
      cy.get('select[name="appointmentTime"]').select('09:00'); // giờ đã bị đặt trước
      cy.get('button[type="submit"]').click();
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Giờ này đã được đặt rồi');
      });
    });
  
    it('✅ Đặt lịch thành công với ngày và giờ hợp lệ', () => {
      cy.get("table").first().within(() => {
        cy.get('td[data-date="2025-05-01"]').click();
      });
  
      cy.get('input[name="ownerName"]').type('Ngô Văn D');
      cy.get('input[name="pet"]').type('Rùa');
      cy.get('input[name="phone"]').type('0911223344');
      cy.get('input[name="email"]').type('rua@example.com');
      cy.get('select[name="appointmentTime"]').select('10:00');
      cy.get('button[type="submit"]').click();
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('✅ Đặt lịch thành công!');
      });
    });
  
    it('❌ Không cho đặt nếu không chọn ngày', () => {
      // Không click vào ngày nào
      cy.get('input[name="ownerName"]').type('Không Chọn Ngày');
      cy.get('input[name="pet"]').type('Chó');
      cy.get('input[name="phone"]').type('0900000000');
      cy.get('input[name="email"]').type('kochon@example.com');
      cy.get('select[name="appointmentTime"]').select('08:00');
      cy.get('button[type="submit"]').click();
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Vui lòng chọn ngày');
      });
    });
  
    it('❌ Không cho đặt nếu không chọn giờ', () => {
      cy.get("table").first().within(() => {
        cy.get('td[data-date="2025-05-01"]').click();
      });
  
      cy.get('input[name="ownerName"]').type('Không Chọn Giờ');
      cy.get('input[name="pet"]').type('Mèo');
      cy.get('input[name="phone"]').type('0900000001');
      cy.get('input[name="email"]').type('kochongio@example.com');
      // Không chọn giờ
      cy.get('button[type="submit"]').click();
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Vui lòng chọn giờ');
      });
    });
  });
  