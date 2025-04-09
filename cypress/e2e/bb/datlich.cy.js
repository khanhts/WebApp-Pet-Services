describe("Đặt lịch", ()=>{
    beforeEach(() => {
      cy.visit('http://localhost:3000/');
    });
  
    it('✅ Đặt lịch thành công với ngày và giờ hợp lệ', () => {
      // Click vào ngày cụ thể trên FullCalendar
      cy.get("table").first().within(() => {
        cy.get('td[data-date="2025-04-17"]').click();
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

    // ❌ Không cho chọn ngày trong quá khứ
    it('❌ Cảnh báo khi chọn ngày trong quá khứ', () => {
        cy.get("table").first().within(() => {
            cy.get('td[data-date="2025-04-08"]').click();
        });
        cy.on('window:alert', (txt) => {
        expect(txt).to.contains('❌ Không thể đặt lịch vào ngày trong quá khứ!');
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

    // ❌ Không cho đặt lịch nếu không điền đầy đủ thông tin
it('❌ Cảnh báo khi không điền đầy đủ thông tin', () => {
    cy.get("table").first().within(() => {
        cy.get('td[data-date="2025-04-18"]').click();
    });
    // Không điền thông tin nào
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (txt) => {
        expect(txt).to.contains('❌ Vui lòng điền đầy đủ thông tin!');
    });
});

// ❌ Cảnh báo khi nhập sai định dạng email
it('❌ Cảnh báo khi nhập sai định dạng email', () => {
    cy.get("table").first().within(() => {
        cy.get('td[data-date="2025-04-19"]').click();
    });
    cy.get('input[name="ownerName"]').type('Nguyễn Thị A');
    cy.get('input[name="pet"]').type('Chó');
    cy.get('input[name="phone"]').type('0987654321');
    cy.get('input[name="email"]').type('sai-dinh-dang-email');
    cy.get('select[name="appointmentTime"]').select('09:00');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (txt) => {
        expect(txt).to.contains('❌ Email không hợp lệ!');
    });
});

it('❌ Cảnh báo khi số điện thoại không hợp lệ', () => {
    cy.get("table").first().within(() => {
      cy.get('td[data-date="2025-04-24"]').click();
    });

    cy.get('input[name="ownerName"]').should('be.visible').type('Trịnh Văn A');
    cy.get('input[name="pet"]').type('Chó');
    cy.get('input[name="phone"]').type('123abc'); // Sai định dạng
    cy.get('input[name="email"]').type('a@example.com');
    cy.get('select[name="appointmentTime"]').select('08:00');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('button[type="submit"]').click();

    cy.get('@alertStub').should('have.been.calledWithMatch', '❌ Số điện thoại không hợp lệ');
  });
  
  
  
  





it('❌ Cảnh báo khi không nhập tên chủ thú cưng', () => {
    cy.get("table").first().within(() => {
      cy.get('td[data-date="2025-04-23"]').click();
    });
  
    cy.get('input[name="pet"]').type('Chó');
    cy.get('input[name="phone"]').type('0911222333');
    cy.get('input[name="email"]').type('abc@example.com');
    cy.get('select[name="appointmentTime"]').select('09:00');
  
    cy.get('button[type="submit"]').click();
  
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('❌ Vui lòng nhập tên chủ thú cưng');
    });
  });
  
  
  


})