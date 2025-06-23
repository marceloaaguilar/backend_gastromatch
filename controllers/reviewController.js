const User = require('../models/user');
const Review = require('../models/review');

module.exports.assignReview = async (req, res) => {
  const { recipient_email } = req.body;
  try {
    if (req.isAuthenticated()) {
      const reviewer = await User.findByPk(req.params.id);
      const recipient = await User.findOne({ where: { email: recipient_email } });

      if (!reviewer || !recipient) {
        req.flash('error', 'Usuário não encontrado!');
        return res.redirect('back');
      }

      const alreadyAssigned = await reviewer.hasAssignedReview(recipient);

      if (alreadyAssigned) {
        req.flash('error', 'Review já atribuída!');
        return res.redirect('back');
      }

      await reviewer.addAssignedReview(recipient); 
      req.flash('success', 'Review atribuída com sucesso!');
      return res.redirect('back');
    } else {
      req.flash('error', 'Não autenticado.');
    }
  } catch (err) {
    console.log('Erro ao atribuir review:', err);
    req.flash('error', 'Erro interno ao atribuir review.');
    return res.redirect('back');
  }
};

module.exports.submitReview = async (req, res) => {
  const { recipient_email, feedback } = req.body;
  try {
    const recipient = await User.findOne({ where: { email: recipient_email } });
    const reviewer = await User.findByPk(req.params.id);

    if (!recipient || !reviewer) {
      req.flash('error', 'Usuário não encontrado!');
      return res.redirect('back');
    }

    const reviewString = feedback.trim();
    if (reviewString === '') {
      req.flash('error', 'Feedback não pode ficar vazio!');
      return res.redirect('back');
    }

    const review = await Review.create({
      review: reviewString,
      reviewerId: reviewer.id,
      recipientId: recipient.id
    });

    await reviewer.removeAssignedReview(recipient);

    req.flash('success', 'Review enviada com sucesso!');
    return res.redirect('back');
  } catch (err) {
    console.log('Erro ao enviar review:', err);
    req.flash('error', 'Erro interno ao enviar review.');
    return res.redirect('back');
  }
};


module.exports.updateReview = async (req, res) => {
  try {
    const { feedback } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      req.flash('error', 'Review não existe!');
      return res.redirect('back');
    }

    await review.update({ review: feedback });
    req.flash('success', 'Review atualizada!');
    return res.redirect('back');
  } catch (err) {
    console.log('Erro ao atualizar review:', err);
    req.flash('error', 'Erro interno ao atualizar review.');
    return res.redirect('back');
  }
};
