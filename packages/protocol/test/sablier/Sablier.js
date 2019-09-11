const { devConstants } = require("@sablier/dev-utils");
const { shouldBehaveLikeSablier } = require("./Sablier.behavior");

const CERC20Mock = artifacts.require("./CERC20Mock.sol");
const ERC20Mock = artifacts.require("./ERC20Mock.sol");
const EvilERC20 = artifacts.require("./EvilERC20.sol");
const NonStandardERC20 = artifacts.require("./NonStandardERC20.sol");
const Sablier = artifacts.require("./Sablier.sol");

CERC20Mock.numberFormat = "BigNumber";
ERC20Mock.numberFormat = "BigNumber";
EvilERC20.numberFormat = "BigNumber";
NonStandardERC20.numberFormat = "BigNumber";
Sablier.numberFormat = "BigNumber";

const { INITIAL_EXCHANGE_RATE, STANDARD_SALARY } = devConstants;

contract("Sablier", function sablier([alice, bob, carol, eve]) {
  beforeEach(async function() {
    const opts = { from: alice };
    this.token = await ERC20Mock.new(opts);
    await this.token.mint(alice, STANDARD_SALARY.multipliedBy(2).toString(10), opts);

    this.evilToken = await EvilERC20.new(opts);
    await this.evilToken.mint(alice, STANDARD_SALARY.multipliedBy(2).toString(10), opts);

    const cTokenDecimals = 8;
    this.cToken = await CERC20Mock.new(this.token.address, INITIAL_EXCHANGE_RATE.toString(10), cTokenDecimals, opts);
    await this.token.approve(this.cToken.address, STANDARD_SALARY.multipliedBy(2).toString(10), opts);
    await this.cToken.mint(STANDARD_SALARY.toString(10), opts);

    this.nonStandardERC20Token = await NonStandardERC20.new(opts);
    this.nonStandardERC20Token.nonStandardMint(alice, STANDARD_SALARY.toString(10), opts);

    this.sablier = await Sablier.new();
  });

  shouldBehaveLikeSablier(alice, bob, carol, eve);
});
