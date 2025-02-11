async function createPartner(event, partner) {
  const { type, name, ceo, email, phone, address, rating } = partner;

  try {
    await global.dbclient.query(`INSERT into partners (organization_type, name, ceo, email, phone, address, rating) values('${type}', '${name}', '${ceo}', '${email}', '${phone}', '${address}', ${rating})`)
    dialog.showMessageBox({ message: 'Успех! Партнер создан' })
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Ошибка', "Партнер с таким именем уже есть")
  }
}

describe('createPartner', () => {
  let dbClientMock;
  let dialogMock;

  beforeEach(() => {
    dbClientMock = jest.fn().mockImplementation(() => ({
      query: jest.fn().mockResolvedValueOnce({ rows: [] }),
      close: jest.fn(),
    }));

    dialogMock = jest.fn().mockImplementation(() => ({
      showMessageBox: jest.fn(),
      showErrorBox: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  
  it('должен успешно создать партнера', async () => {
    
    const partnerData = { type:'testType', name:'testName', ceo:'testCeo', email:'testEmail@example.com', phone:'+1234567890', address:'Test Address', rating:5 };
    
    const result = await createPartner(dbClientMock(), dialogMock(), partnerData);
    
    expect(result).toBe(true);
  
});

it('должен показать ошибку при существующем имени партнера ', async () => {

const errorToThrow = new Error("Партнер с таким именем уже есть");
dbClientMock.mockImplementationOnce(() => ({
query :jest.fn().mockRejectedValue(errorToThrow)
}));

const partnerData={type:"existingType",name:"existingName",ceo:"existingCeo",email:"existing@example.com",phone:"+9876543210",address:"Existing Address",rating :4};

await expect(createPartner(dbClientMock(),dialogMock(),partnerData)).resolves.toBe(false);

expect(dialogMock().showErrorBox).toHaveBeenCalledTimes(1); 
expect(dialogMock().showErrorBox).toHaveBeenCalledWith("Ошибка","Партнер с таким именем уже есть");

});
});
