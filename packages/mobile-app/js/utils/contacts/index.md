## contact模块接口描述
钱包APP和钱包浏览器插的联系人模块基本相同，故进行同构数据类型和方法。


### contactItem的类型
```
{
    id: string,  // 每个联系人的唯一标识 String(Data.now())生成
    name: string // 唯一的联系人名称
    address: string, // 联系人钱包地址（不含钱后缀）
    chainType: "ELF"|"ERC" // 现在只支持这两种
 }
```

### contactData的类型
例如
```
const MOCK_DATA = {
  ELF: [
    {
      id: '1000',
      name: 'main1',
      address: 'sdhajkdjksdjskdjaskdnjsandandkjsandsajkdnandjandsadanjdadkgagakmkklgaga',
      chainType: 'ELF',
    },
    {
      id: '200',
      name: 'main2',
      address: 'sdhajkdjksdjskdjaskdnjsandandkjsandsajkdnandjandsadanjdadkgagakmkklgaga',
      chainType: 'ELF',
    },
  ],
  ERC: [
    {
      id: '322',
      name: 'side1',
      address: 'sdhajkdjksdjskdjaskdnjsandandkjsandsajkdnandjandsadanjdadkgagakmkklgaga',
      chainType: 'ERC',
    },
    {
      id: '45',
      name: 'side2',
      address: 'sdhajkdjksdjskdjaskdnjsandandkjsandsajkdnandjandsadanjdadkgagakmkklgaga',
      chainType: 'ERC',
    },
  ],
};
```

### contact模块相关方法说明
getHandleContactListResult:传入conTactData
```

```




