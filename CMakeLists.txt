cmake_minimum_required(VERSION 3.30)
project(db_counter)

set(CMAKE_BUILD_TYPE Debug)
# adding prefix path to find the package config file for the boost
set(CMAKE_PREFIX_PATH ${CMAKE_PREFIX_PATH} "/opt/boost/lib/cmake")

find_package(Boost REQUIRED COMPONENTS headers context json regex url charconv) # ?

find_package(OpenSSL REQUIRED)

add_executable(http_server  src/http_server.cpp src/sep_comp.cpp)

target_link_libraries(http_server PUBLIC 
                                        Boost::headers
                                        Boost::context
                                        Boost::json
                                        Boost::regex
                                        Boost::url
                                        Boost::charconv
                                        OpenSSL::Crypto
                                        OpenSSL::SSL
                                        )

add_executable(sql_client src/sql_client.cpp src/sep_comp.cpp)

target_link_libraries(sql_client PUBLIC 
                                        Boost::headers
                                        Boost::context
                                        Boost::json
                                        Boost::regex
                                        Boost::url
                                        Boost::charconv
                                        OpenSSL::Crypto
                                        OpenSSL::SSL
                                        )


target_compile_definitions(http_server 
            PUBLIC
            BOOST_ASIO_SEPARATE_COMPILATION
            BOOST_BEAST_SEPARATE_COMPILATION
            BOOST_MYSQL_SEPARATE_COMPILATION
)

target_compile_definitions(sql_client  
            PUBLIC
            BOOST_ASIO_SEPARATE_COMPILATION
            BOOST_BEAST_SEPARATE_COMPILATION
            BOOST_MYSQL_SEPARATE_COMPILATION
)