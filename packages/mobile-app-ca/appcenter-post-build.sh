if [ "$AGENT_JOBSTATUS" == "Succeeded" ]; then

    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "android" ];
     then
        # curl -X POST -H "Content-Type: application/json" \
        # -d '{"msg_type":"text","content":{"text":"DID:ANDROID端最新包 （id:'$APPCENTER_BUILD_ID'） build成功, 可在appcenter中下载最新包进行测试  https://install.appcenter.ms/orgs/aelf-web/apps/DID-Android"}}' \
        # https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
        curl -X POST -H "Content-Type: application/json" \
        -d '{
            "msg_type": "post",
            "content": {
                "post": {
                    "zh_cn": {
                        "title": "代码包更新通知",
                        "content": [
                            [{
                                    "tag": "text",
                                    "text": "最新Android代码包（id:'$APPCENTER_BUILD_ID'）已经更新: "
                                },
                                {
                                    "tag": "a",
                                    "text": "点击此处",
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-Android"
                                },
                                      {
                                    "tag": "text",
                                    "text": "进行查看和下载"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v2_4fe5ee4e-d195-47b8-a783-33a7201118bg"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi


    # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios" ];
     then
        # curl -X POST -H "Content-Type: application/json" \
        # -d '{"msg_type":"text","content":{"text":"DID:IOS端最新包（id:'$APPCENTER_BUILD_ID'） build成功, 可在appcenter中下载最新包进行测试 https://install.appcenter.ms/orgs/aelf-web/apps/DID-IOS"}}' \
        # https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
        curl -X POST -H "Content-Type: application/json" \
        -d '{
            "msg_type": "post",
            "content": {
                "post": {
                    "zh_cn": {
                        "title": "代码包更新通知",
                        "content": [
                            [
                                {
                                    "tag": "text",
                                    "text": "最新IOS代码包（id:'$APPCENTER_BUILD_ID'）已经更新，"
                                },
                                {
                                    "tag": "a",
                                    "text": "点击此处",
                                    "href": "https://install.appcenter.ms/orgs/aelf-web/apps/DID-IOS"
                                },
                                {
                                    "tag": "text",
                                    "text": "进行查看和下载"
                                },
                                {   
                                    "tag": "img",
                                    "image_key": "img_v2_4dceff8d-f98a-4774-9319-ac019165206g"
                                }
                            ]
                        ]
                    }
                }
            }
        }' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2
    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

     # Example: Upload main branch app binary to HockeyApp using the API
    if [ "$PLATFORM_TYPE" == "ios-testFlight" ];
     then
        # curl -X POST -H "Content-Type: application/json" \
        # -d '{"msg_type":"text","content":{"text":"DID:IOS端最新包（id:'$APPCENTER_BUILD_ID'） 已build成功并推送到testFlight，您可在testFlight查看最新版本的DID应用,并进行内部测试"}}' \
        # https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2

        curl -X POST -H "Content-Type: application/json" \
         -d '{"msg_type":"text","content":{"text":"DID:IOS端最新包（id:'$APPCENTER_BUILD_ID'） 已build成功并推送至TestFlight，您可申请进入内部测试组，并在TestFlight查看下载最新版本的DID应用"}}' \
        https://open.feishu.cn/open-apis/bot/v2/hook/f2d3fffd-c630-4e59-86e3-e7053a64e4b2

    else
        echo "Current branch is $APPCENTER_BRANCH"
    fi

fi




