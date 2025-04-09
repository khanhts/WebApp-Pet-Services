describe("Đặt lịch", ()=>{
    beforeEach(() => {
        cy.intercept('http://localhost:3000/appointments/disabled-dates').as("getdisableddates");
        cy.intercept('http://localhost:3000/appointments').as("getappointments");
      cy.visit('http://localhost:3000/');
      cy.wait('@getdisableddates');
      cy.wait('@getappointments');
    });
    
    it('Đặt lịch ngày trong quá khứ', () => {
        cy.get("table").first().within(() => {
            cy.get('td[data-date="2025-04-07"]').click();
          });
          cy.on('window:alert', (txt) => {
            expect(txt).to.contains('❌ Không thể đặt lịch vào ngày trong quá khứ!');
          });
    })

    it('Đặt lịch ngày lễ', () => {
        cy.get("table").first().within(() => {
            cy.get('td[data-date="2025-04-30"]').click();
          });
          cy.on('window:alert', (txt) => {
            expect(txt).to.contains('❌ Ngày này đã đầy lịch hoặc là ngày lễ, vui lòng chọn ngày khác!');
          });
    })

    it('✅ Đặt lịch thành công với ngày nhưng giờ không hợp lệ', () => {
        // Click vào ngày cụ thể trên FullCalendar
        cy.get("table").first().within(() => {
            cy.get('td[data-date="2025-04-17"]').click();
            cy.url().should('include', '/add-form.html?date=2025-04-17');
            
            
        });
        cy.get('select[name="appointmentTime"]').select('08:00');
        cy.get('input[name="ownerName"]').type('Lê Minh Hải');
        cy.get('input[name="pet"]').type('Mèo');
        cy.get('input[name="phone"]').type('0123456789');
        cy.get('input[name="email"]').type('duc@example.com');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (txt) => {
              expect(txt).to.contains('❌ Đặt lịch thất bại!');
            });
      });

    it('✅ Đặt lịch thành công với ngày nhưng tên để trống', () => {
        // Click vào ngày cụ thể trên FullCalendar
        cy.get("table").first().within(() => {
            cy.get('td[data-date="2025-04-17"]').click();
            cy.url().should('include', '/add-form.html?date=2025-04-17'); // hoặc route tương ứng
            
            
        });
        cy.get('select[name="appointmentTime"]').select('08:00');
        cy.get('input[name="ownerName"]').then(($input) => {
            expect($input[0].checkValidity()).to.be.true;
          });
          
        // cy.get('input[name="pet"]').type('Mèo');
        // cy.get('input[name="phone"]').type('0123456789');
        // cy.get('input[name="email"]').type('duc@example.com');
        // // cy.get('button[type="submit"]').click();
        // cy.get('form').submit();

        // cy.get('input[name="ownerName"]')[0].checkValidity();

        
    //     cy.on('window:alert', (txt) => {
    //           expect(txt).to.contains('❌ Đặt lịch thất bại!');
    //         });
      });
})