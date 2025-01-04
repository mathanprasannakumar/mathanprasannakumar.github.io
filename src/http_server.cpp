#include <iostream>
#include <memory>
// asio headers
#include <boost/asio.hpp>
#include <boost/asio/spawn.hpp>
// beast headers
#include <boost/beast/core.hpp>
#include <boost/beast/version.hpp>
#include <boost/beast/http.hpp>
// sql related headers
#include <boost/mysql/any_connection.hpp>
#include <boost/mysql/connect_params.hpp> 
#include <boost/mysql/error_with_diagnostics.hpp>
#include <boost/mysql/results.hpp>
#include <fstream>
#include <map>

namespace sql = boost::mysql;

class sql_connection: public std::enable_shared_from_this<sql_connection>
{
    public:
        sql_connection(boost::asio::io_context& ioc,std::map<std::string,std::string> put_pair): connection(ioc),ioc(ioc),put_pair(put_pair){

            for(auto it = put_pair.begin();it!=put_pair.end();it++)
            {
                std::cout<<"sql Put Pair first val :"<<it->first<<std::endl;
                std::cout<<"sql Put Pair second val :"<<it->second<<std::endl;
            }
            
        }

        void make_connection()
        {
            auto self  = shared_from_this();
            connect_params.server_address.emplace_host_and_port("mysql");
            connect_params.username="root";
            connect_params.password="";

            boost::asio::spawn(ioc,
            [self](boost::asio::yield_context yield)
            {

                self->send_query(yield);
            
            },
            [](std::exception_ptr ex)
            {

                if(ex)   
                    std::rethrow_exception(ex);
            }
            );
        }

    private:
        sql::any_connection connection;
        sql::connect_params connect_params;
        boost::asio::io_context &ioc;
        std::map<std::string,std::string> put_pair;


        void send_query(boost::asio::yield_context yield)
        {
            //@ error has to be handled here 
            connection.async_connect(connect_params,yield);

            boost::mysql::results results;


            std::string query = "SHOW DATABASES LIKE '"+put_pair["db"]+"';";


            connection.async_execute(query,results,yield);

            if(!results.rows().size())
            {
                query = "CREATE DATABASE "+put_pair["db"]+";";

                connection.async_execute(query,results,yield);
                
            }
            
            query = "USE "+put_pair["db"]+";";

            connection.async_execute(query,results,yield);

            query = "SHOW TABLES LIKE '"+put_pair["table"]+"'";

            connection.async_execute(query,results,yield);

            if(!results.rows().size())
            {
                query = "CREATE TABLE "+put_pair["table"]+
                        " ( id INT AUTO_INCREMENT PRIMARY KEY,"
                        "  value INT )";

                connection.async_execute(query,results,yield); 
            }

            query = "INSERT INTO "+put_pair["table"]+" (value) VALUES (1)";

            connection.async_execute(query,results,yield);

            std::cout<<"Inserted new row"<<std::endl;

            connection.close();
        }
};

         

class http_connection : public std::enable_shared_from_this<http_connection>
{
    public: 
        // param : socket : holds the new connection socket resources 
        http_connection(boost::asio::ip::tcp::socket socket,boost::asio::io_context& io): socket_(std::move(socket)),response_(),ioc(io)
        {

        }
        void start()
        {
            read_requests();
        }

    private:
        boost::asio::ip::tcp::socket socket_;

        boost::beast::flat_buffer buffer_ {8192};

        boost::beast::http::response<boost::beast::http::dynamic_body> response_;

        boost::beast::http::request_parser<boost::beast::http::empty_body> req_parser_empty;
        boost::beast::http::request<boost::beast::http::dynamic_body> req_db;
        boost::beast::http::request<boost::beast::http::string_body> req_string;

        boost::asio::io_context& ioc;


        std::string put_data;

        std::map<std::string,std::string> put_pair;

        void read_requests()
        {
            auto self = shared_from_this(); // without this this object will be destroyed as self is 
            // alive , object is alive
            std::cout<<"inside read requests:"<<std::endl;

            boost::beast::http::async_read(socket_,buffer_,req_string,[self](boost::beast::error_code ec, std::size_t bytes_transferred)
            {
                boost::ignore_unused(bytes_transferred);
                if(!ec) 
                    self->process_request(); // based on the route send the response
                else
                    std::cout<<"error in async read :"<<ec.message()<<std::endl;
            });
        }

        std::string html_read(std::string path) 
        { 
            std::ifstream file(path);
            if(!file.is_open())
            { 
                throw std::runtime_error("File not found");
            }
            std::ostringstream oss;
            oss << file.rdbuf();
            return oss.str();
        }

        void proceed_get()
        { 
            // parse the req and send the response
            response_.version(req_string.version());
            std::cout<<"Request target :"<<req_string.target()<<std::endl;
            if(req_string.target()=="/")    
            { 
                response_.result(boost::beast::http::status::ok);
                response_.set(boost::beast::http::field::server,"DBCounter");
                response_.set(boost::beast::http::field::content_type,"text/html");
                boost::beast::ostream(response_.body()) << html_read("../html/index.html").c_str();
                response_.prepare_payload();
            }
            else if (req_string.target() =="/favicon.ico")
            { 
                std::ifstream file("../assets/favicon.ico",std::ios::binary);

                if (!file)
                    goto bad_request; 

                response_.result(boost::beast::http::status::ok);
                response_.set(boost::beast::http::field::server,"DBCounter");
                response_.set(boost::beast::http::field::content_type,"image/x-icon");
                boost::beast::ostream(response_.body()) << std::string((std::istreambuf_iterator<char>(file)),std::istreambuf_iterator<char>()).c_str();
            }
            else
            { 
                bad_request:
                response_.result(boost::beast::http::status::bad_request);
                response_.set(boost::beast::http::field::server,"DBCounter");
                response_.set(boost::beast::http::field::content_type,"text/plain");
                boost::beast::ostream(response_.body()) << "Invalid route please access the proper endpoint";
                response_.prepare_payload();
            }
            write_response();
        }

        void process_request()
        { 

            switch(req_string.method())
            {
                case boost::beast::http::verb::get:
                {
                    // getting the header from the empty type req parser to the dynamic type request parser
                    // boost::beast::http::request_parser<boost::beast::http::dynamic_body>req_parser_db {std::move(req_parser_empty)};
                    // reading the body data from the socker_ to the request
                    proceed_get();
                    break;
                }
                case boost::beast::http::verb::post:
                {

                    // boost::beast::http::request_parser<boost::beast::http::string_body> req_parser_string  {std::move(req_parser_empty)};
                    proceed_put();
                    break;
                }
            }
        }
        void parse_put_data()
        {
            std::istringstream stream (put_data); 

            std::string ex;

            while(std::getline(stream,ex,'&'))
            {
                auto  pos = ex.find("=");

                if(pos!=std::string::npos)
                {
                   put_pair[ex.substr(0,pos)] = ex.substr(pos+1);
                }
            }

            for(auto it = put_pair.begin();it!=put_pair.end();it++)
            {
                std::cout<<"Put Pair first val :"<<it->first<<std::endl;
                std::cout<<"Put Pair second val :"<<it->second<<std::endl;
            }

        }

        void proceed_put()
        {
            // extract the input data from the form 
           // send back some infomation
           put_data = req_string.body();

           parse_put_data();

           proceed_db(); 

           response_.version(req_string.version());
           response_.set(boost::beast::http::field::server,"DBCounter");
           response_.set(boost::beast::http::field::content_type,"text/plain");
           boost::beast::ostream(response_.body())<< "Thank you for entering the Input";
           response_.prepare_payload();
           write_response();
        }

        void proceed_db()
        {
           // here check for db and table     
              std::make_shared<sql_connection>(ioc,put_pair)->make_connection();
        }

        // void create_response()
        // {

        //     if(request_.target()=="/")
        //     {
        //         response_.set(boost::beast::http::field::content_type,"text/html");

        //         std::ifstream file("../html/index.html");

        //         if(!file.is_open())
        //         {
        //            throw std::runtime_error("Cannot open the html file "); 
        //         }
        //         boost::beast::ostream(response_.body()) << file.rdbuf();
              
        //     }
        //     else
        //     {
        //         response_.set(boost::beast::http::field::content_type,"text/plain");
        //         boost::beast::ostream(response_.body())
        //         << "Invalid route , please change the route";
        //     }
        // }

        void write_response()
        {
           auto self = shared_from_this();

           response_.content_length(response_.body().size()); 

            // write data from response_ to the socket stream
           boost::beast::http::async_write(socket_,response_,[self](boost::beast::error_code ec, std::size_t)
            {
                self->socket_.shutdown(boost::asio::ip::tcp::socket::shutdown_send,ec);
            });
        }

};


void http_server(boost::asio::ip::tcp::acceptor & acceptor,boost::asio::ip::tcp::socket  &socket,boost::asio::io_context& ioc)
{
    // it initiates an async operations to accept new connection, when new connection is being formed handler is being invoked
   acceptor.async_accept(socket,
    [&](boost::beast::error_code ec) // from the stack over flow page , https://stackoverflow.com/questions/17715794/repeated-stdmove-on-an-boostasio-socket-object-in-c11
    {
        // when new connection is being formed ,, socket holds the ownership of the new connected socket resources from acceptor 
        // then callback is executed , socket resources is transferred from here to the another handler, after this socket here will be valid but holds no ownership
        if(!ec)
        {
            std::make_shared<http_connection>(std::move(socket),ioc)->start();

        }
        // socket will be empty(no ownership)
        http_server(acceptor,socket,ioc);
    }
   );
}


int main(int argc, char** argv)
{
    if(argc!=3)
    {
        std::cerr<<"Second argument : localhost/0.0.0.0\n";
        std::cerr<<"Third argument: port \n";
        std::cerr<<"Program should run like : program localhost port\n";
        std::exit(EXIT_FAILURE);
    }

    // from string to a address_v4 type representation for further utility
    auto const_address = boost::asio::ip::make_address(argv[1]);
    // conv from string to unsigned int 16 
    u_int16_t port = static_cast<u_int16_t>(std::atoi(argv[2]));

    // creating a io context object for the io functionality
    boost::asio::io_context ioc {1}; 

    // there are multiple ways , acceptor can be created 
    // specific to below , acceptor is constructed and opens it to listen to the specified endpoint
    boost::asio::ip::tcp::acceptor acceptor {ioc,{const_address,port}};

    // socket is constructed and not opened and connected // in the docs it is 
    // mentionoed that socket should be opened and should be connected before data transfer
    boost::asio::ip::tcp::socket socket(ioc);

    http_server(acceptor,socket,ioc);

    ioc.run();

    return 0;
}


