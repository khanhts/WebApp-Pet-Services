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

})