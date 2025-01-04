#include <iostream>
#include <string>
#include <exception> // header used for providing exception classes
#include <chrono>
#include <cstdint> // header used for providing std fixed with int types 

#include <boost/mysql.hpp>
#include <boost/asio.hpp>
#include <boost/asio/spawn.hpp>

#include <boost/system/error_code.hpp> // ? 
#include <boost/endian/conversion.hpp>
#include <boost/mysql/any_connection.hpp>



void send_query(boost::mysql::any_connection & any_connection,boost::mysql::connect_params & params,
boost::asio::yield_context yield)
{
    any_connection.async_connect(params,yield);

    const char* query = "SELECT 'Hello world!'"; 

    boost::mysql::results result;

    any_connection.async_execute(query,result,yield);

    std::cout<<" result value : "<<result.rows().at(0).at(0)<<std::endl;
}

// boost::asio::awaitable<void> main_impl(boost::mysql::any_connection &any_connection,std::string_view user_name,std::string_view password,std::string_view host_name)
// {

//     boost::mysql::pool_params params; // parameters used to configure the pool
//     params.server_address.emplace_host_and_port(host_name);
//     params.username = user_name; // ?
//     params.password = password; // ? 

//     co_await any_connection.async_connect(params);

//     char* query = "SELECT 'Hello World!'";

//     boost::mysql::results results;

//     co_await any_connection.async_execute(query,results);

//     std::cout<<"Results :" <<results.row().at(0).at(0)<<std::endl;

//     co_await any_connection.async_close();
// }


int main(int argc,char**argv)
{
    if(argc!=4)
    {
        std::cout<<"Usage : program hostname username password\n";
        return 1;
    }
    try 
    {
        boost::asio::io_context ioc; // for io functionality used by io objects

        boost::mysql::any_connection any_connection(ioc);

        boost::mysql::connect_params params;

        params.server_address.emplace_host_and_port(argv[1]);
        params.username=argv[2];
        params.password=argv[3];

        boost::mysql::diagnostics diag;

        boost::asio::spawn(ioc,[&](boost::asio::yield_context yield)
        {
            send_query(any_connection,params,yield);
        },[](std::exception_ptr ex)
        {
            if(ex)
                std::rethrow_exception(ex);
        }
        );

        ioc.run();
    }
    catch(const boost::mysql::error_with_diagnostics & err) {

        std::cerr<<"Error: "<<err.what()<<"error code : "<<err.code()<<"\n"
        <<"Server Diagnostics: "<<err.get_diagnostics().server_message()<<std::endl;
        return 1; // non-zero for error return
    }

    return 0;
}