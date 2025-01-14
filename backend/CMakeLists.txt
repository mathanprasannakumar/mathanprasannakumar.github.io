cmake_minimum_required(VERSION 3.30)
project(chat_app)

set(CMAKE_BUILD_TYPE Debug)

set(CMAKE_PREFIX_PATH ${CMAKE_PREFIX_PATH} "/opt/boost/lib/cmake")

# what each of these library does ? why it is needed ? 
find_package(Boost REQUIRED COMPONENTS headers context json regex url charconv)

find_package(OpenSSL REQUIRED)

add_executable(chat_app  src/chat_app.cpp src/sep_comp.cpp)

target_link_libraries(chat_app PUBLIC 
                                        Boost::headers
                                        Boost::context
                                        Boost::json
                                        Boost::regex
                                        Boost::url
                                        Boost::charconv
                                        OpenSSL::Crypto
                                        OpenSSL::SSL
                                        )

target_compile_definitions(chat_app 
            PUBLIC
            BOOST_ASIO_SEPARATE_COMPILATION
            BOOST_BEAST_SEPARATE_COMPILATION
            BOOST_MYSQL_SEPARATE_COMPILATION
)
