describe("🧪 White Box Testing - Đặt lịch", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/");
    });
  
    it("✅ WBT-TC-01: Đặt lịch thành công với ngày và giờ hợp lệ", () => {
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
  
    it('✅ WBT-TC-02: Đặt lịch thành công cho "Mèo" với giờ hợp lệ', () => {
      cy.get('td[data-date="2025-04-15"]').click();
  
      cy.get('form').should('be.visible');
      cy.get('input[name="ownerName"]').type("Trần Thị B");
      cy.get('input[name="pet"]').type("Mèo");
      cy.get('input[name="phone"]').type("0911223344");
      cy.get('input[name="email"]').type("meo@example.com");
      cy.get('input[name="appointmentTime"]').type("15:00");
      cy.get('select[name="status"]').select("confirmed");
  
      cy.get('button[type="submit"]').click();
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Đặt lịch thành công");
      });
    });
  
    it("✅ WBT-TC-03: Đặt lịch với số điện thoại hợp lệ", () => {
      cy.get('td[data-date="2025-04-15"]').click();
  
      cy.get('form').should('be.visible');
      cy.get('input[name="ownerName"]').type("Lê Văn C");
      cy.get('input[name="pet"]').type("Chim");
      cy.get('input[name="phone"]').type("0987650000");
      cy.get('input[name="email"]').type("chim@example.com");
      cy.get('input[name="appointmentTime"]').type("14:30");
      cy.get('select[name="status"]').select("confirmed");
  
      cy.get('button[type="submit"]').click();
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Đặt lịch thành công");
      });
    });
  
    it("✅ WBT-TC-04: Đặt lịch thành công với email hợp lệ", () => {
      cy.get('td[data-date="2025-04-15"]').click();
  
      cy.get('form').should('be.visible');
      cy.get('input[name="ownerName"]').type("Phạm Văn D");
      cy.get('input[name="pet"]').type("Cá");
      cy.get('input[name="phone"]').type("0999888777");
      cy.get('input[name="email"]').type("duc@example.com");
      cy.get('input[name="appointmentTime"]').type("11:15");
      cy.get('select[name="status"]').select("confirmed");
  
      cy.get('button[type="submit"]').click();
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Đặt lịch thành công");
      });
    });
  
    it('✅ WBT-TC-05: Đặt lịch với trạng thái "confirmed"', () => {
      cy.get('td[data-date="2025-04-15"]').click();
  
      cy.get('form').should('be.visible');
      cy.get('input[name="ownerName"]').type("Ngô Văn E");
      cy.get('input[name="pet"]').type("Thỏ");
      cy.get('input[name="phone"]').type("0909090909");
      cy.get('input[name="email"]').type("tho@example.com");
      cy.get('input[name="appointmentTime"]').type("09:45");
      cy.get('select[name="status"]').select("confirmed");
  
      cy.get('button[type="submit"]').click();
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Đặt lịch thành công");
      });
    });
  
    it("❌ WBT-TC-06: Đặt lịch thất bại vì số điện thoại không hợp lệ", () => {
      cy.get('td[data-date="2025-04-15"]').click();
  
      cy.get('form').should('be.visible');
      cy.get('input[name="ownerName"]').type("Phạm Văn F");
      cy.get('input[name="pet"]').type("Chó");
      cy.get('input[name="phone"]').type("0987654321123"); // Số quá dài
      cy.get('input[name="email"]').type("f@example.com");
      cy.get('input[name="appointmentTime"]').type("13:00");
      cy.get('select[name="status"]').select("confirmed");
  
      cy.get('button[type="submit"]').click();
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Số điện thoại không hợp lệ");
      });
    });
  
    it("❌ WBT-TC-07: Đặt lịch thất bại vì ngày đã qua", () => {
      cy.get('td[data-date="2025-04-01"]').click();
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Không thể đặt lịch vào ngày trong quá khứ");
      });
    });
  
    it("❌ WBT-TC-08: Đặt lịch thất bại vì ngày lễ", () => {
      cy.get('td[data-date="2025-04-30"]').click(); // Giả sử là ngày lễ
  
      cy.on("window:alert", (txt) => {
        expect(txt).to.contains("Ngày lễ không thể đặt lịch");
      });
    });
  });
  