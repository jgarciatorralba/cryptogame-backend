import Stock from '../models/stock.js';
import User from '../models/user.js';
import Wallet from '../models/wallet.js';

export default {
  update: async function () {
    const walletJoinStock = await Wallet.findAll({ include: [{ model: Stock, as: 'stock' }] });

    const walletSavePromises = [];
    for (const wallet of walletJoinStock) {
      wallet.value = wallet.quantity * wallet.stock.price;
      walletSavePromises.push(wallet.save());
    }
    await Promise.all(walletSavePromises);

    // const walletJoinUser = await Wallet.findAll({ include: [{ model: User, as: 'user' }] });
    const users = await User.findAll();

    for (const user of users) {
      const wallets = await Wallet.findAll({ where: { user_id: user.user_id } });
      user.estimated = wallets.reduce((total, element) => total + element.value, 0);
    };

    users.sort((a, b) => a.estimated > b.estimated);
    users.forEach((user, index) => { user.ranking = (index + 1); user.save(); });
  }
};
