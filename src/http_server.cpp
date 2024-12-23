#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <boost/asio/strand.hpp>
#include <iostream>
#include <string>

namespace beast = boost::beast;      // Alias for Boost.Beast
namespace http = beast::http;       // Alias for HTTP functionality
namespace net = boost::asio;        // Alias for Boost.Asio
using tcp = net::ip::tcp;           // TCP layer

// Function to handle HTTP requests
void handle_request(http::request<http::string_body>& req, http::response<http::string_body>& res) {
    if (req.method() == http::verb::get) {
        res.result(http::status::ok);
        res.set(http::field::server, "Boost.Beast Example Server");
        res.body() = "<h1>This is just an example</h1>";
        res.prepare_payload();
    } else {
        res.result(http::status::bad_request);
        res.body() = "Unsupported HTTP method.";
        res.prepare_payload();
    }
}

// Session class to handle individual connections
class Session : public std::enable_shared_from_this<Session> {
    tcp::socket socket_;

public:
    explicit Session(tcp::socket socket) : socket_(std::move(socket)) {}

    void start() { read_request(); }

private:
    beast::flat_buffer buffer_;                      // Buffer for reading
    http::request<http::string_body> request_;       // HTTP request
    http::response<http::string_body> response_;     // HTTP response

    void read_request() {
        auto self = shared_from_this();
        http::async_read(
            socket_, buffer_, request_,
            [self](beast::error_code ec, std::size_t bytes_transferred) {
                if (!ec) self->process_request();
            });
    }

    void process_request() {
        handle_request(request_, response_);
        write_response();
    }

    void write_response() {
        auto self = shared_from_this();
        http::async_write(
            socket_, response_,
            [self](beast::error_code ec, std::size_t bytes_transferred) {
                self->socket_.shutdown(tcp::socket::shutdown_send, ec);
            });
    }
};

// Main server class
class Server {
    tcp::acceptor acceptor_; //     tcp::socket::shutdown_send
    tcp::socket socket_;

public:
    Server(net::io_context& ioc, tcp::endpoint endpoint)
        : acceptor_(ioc, endpoint), socket_(ioc) {
        accept();
    }

private:
    void accept() {
        acceptor_.async_accept(socket_, [this](beast::error_code ec) {
            if (!ec) std::make_shared<Session>(std::move(socket_))->start();
            accept();
        });
    }
};

int main(int argc, char* argv[]) {
    try {
        if (argc != 2) {
            std::cerr << "Usage: http_server <port>\n";
            return 1;
        }

        auto const port = static_cast<unsigned short>(std::atoi(argv[1]));

        net::io_context ioc;

        Server server(ioc, tcp::endpoint(tcp::v4(), port));

        ioc.run();
    } catch (std::exception const& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }
}
