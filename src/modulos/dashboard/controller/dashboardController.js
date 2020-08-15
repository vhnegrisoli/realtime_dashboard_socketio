import * as io from "./../../../config/socket/index";

class DashboardController {
  iniciarDashboard(req, res) {
    return res.render("dashboard", {
      card1: 0,
      card2: 0,
      card3: 0,
      card4: 0,
    });
  }

  atualizarDados(req, res) {
    const { labels, data } = req.body;
    let values = {
      labels,
      data,
    };
    const socketIO = io.getSocket();
    socketIO.emit("dados", values);
    return res.json({ message: "Enviado!" });
  }

  novosDados(req, res) {
    console.log("Tô no servidor");
    console.log(req.body);
    return res.render("dashboard", {
      card1: 0,
      card2: 0,
      card3: 0,
      card4: 0,
    });
  }

  iniciarFormulario(req, res) {
    return res.render("main");
  }
}
export default new DashboardController();
