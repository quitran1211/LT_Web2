import React from 'react';
import { Image, Text, View, Page, Document, StyleSheet, Font } from '@react-pdf/renderer';
import logo from '../img/LogoHITC.png';
import NotoSans from '../font/NotoSans-Regular.ttf'; // Thêm file font ttf

// Register font để hỗ trợ tiếng Việt
Font.register({
    family: 'NotoSans',
    src: NotoSans,
});

interface Product {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

interface MyDocumentProps {
    data: {
        products: Product[];
        totalPrice: number;
    };
}

const MyDocument: React.FC<MyDocumentProps> = ({ data }) => {
    const { products = [], totalPrice = 0 } = data;

    const styles = StyleSheet.create({
        page: {
            fontFamily: 'NotoSans',
            fontSize: 11,
            paddingTop: 20,
            paddingLeft: 40,
            paddingRight: 40,
            lineHeight: 1.5,
            flexDirection: 'column',
        },
        spaceBetween: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#3E3E3E',
        },
        titleContainer: { flexDirection: 'row', marginTop: 24 },
        logo: { width: 150 },
        addressTitle: { fontSize: 13, fontWeight: 'bold', fontFamily: 'NotoSans' },
        address: { fontSize: 12, fontFamily: 'NotoSans' },
        theader: {
            marginTop: 20,
            fontSize: 10,
            fontWeight: 'bold',
            paddingVertical: 4,
            paddingHorizontal: 7,
            flex: 1,
            minHeight: 20,
            backgroundColor: '#DEDEDE',
            borderColor: 'whitesmoke',
            borderRightWidth: 1,
            borderBottomWidth: 1,
            fontFamily: 'NotoSans',
        },
        theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1, fontFamily: 'NotoSans', fontWeight: 'bold' },
        tbody: {
            fontSize: 9,
            padding: 4,
            flex: 1,
            minHeight: 20, // đảm bảo đủ cao cho chữ

            borderColor: 'whitesmoke',
            borderRightWidth: 1,
            borderBottomWidth: 1,
            fontFamily: 'NotoSans',
        },
        tbody2: { flex: 2, borderRightWidth: 1 },
        total: {
            fontSize: 9,
            padding: 4,
            flex: 1.5,
            borderColor: 'whitesmoke',
            borderBottomWidth: 1,
            fontFamily: 'NotoSans',
        },
    });


    const InvoiceTitle = () => (
        <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
                <Image style={styles.logo} src={logo} />
            </View>
        </View>
    );

    const UserAddress = () => (
        <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
                <View style={{ maxWidth: 200 }}>
                    <Text style={styles.addressTitle}>
                        Email: <Text style={styles.address}>{localStorage.getItem('username') || 'Unknown'}</Text>
                    </Text>
                    <Text style={styles.addressTitle}>
                        Tổng tiền: <Text style={styles.address}>{totalPrice.toFixed(2)} VND</Text>
                    </Text>
                </View>
            </View>
        </View>
    );

    const TableHead = () => (
        <View style={{ width: '100%', flexDirection: 'row', marginTop: 10, fontWeight: 'bold' }}>
            <View style={[styles.theader, styles.theader2]}>
                <Text style={{ fontFamily: 'NotoSans', fontWeight: 'bold' }}>Mặt hàng</Text>
            </View>
            <View style={styles.theader}>
                <Text style={{ fontFamily: 'NotoSans', fontWeight: 'bold' }}>Giá</Text>
            </View>
            <View style={styles.theader}>
                <Text style={{ fontFamily: 'NotoSans', fontWeight: 'bold' }}>Số lượng</Text>
            </View>
            <View style={styles.theader}>
                <Text style={{ fontFamily: 'NotoSans', fontWeight: 'bold' }}>Thành tiền</Text>
            </View>
        </View>
    );

    const TableBody = () => (
        <>
            {products.map((product: Product) => (
                <View style={{ width: '100%', flexDirection: 'row' }} key={product.productId}>
                    <View style={[styles.tbody, styles.tbody2]}>
                        <Text style={{ fontFamily: 'NotoSans' }}>{product.productName}</Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text style={{ fontFamily: 'NotoSans' }}>{product.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text style={{ fontFamily: 'NotoSans' }}>{product.quantity}</Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text style={{ fontFamily: 'NotoSans' }}>{(product.price * product.quantity).toFixed(2)}</Text>
                    </View>
                </View>
            ))}
        </>
    );

    const TableTotal = () => (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={styles.total}><Text></Text></View>
            <View style={styles.total}><Text></Text></View>
            <View style={styles.tbody}><Text style={{ fontFamily: 'NotoSans', fontWeight: 'bold' }}>Tổng</Text></View>
            <View style={styles.tbody}><Text style={{ fontFamily: 'NotoSans', fontWeight: 'bold' }}>{totalPrice.toFixed(2)}</Text></View>
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <InvoiceTitle />
                <UserAddress />
                <TableHead />
                <TableBody />
                <TableTotal />
            </Page>
        </Document>
    );
};

export default MyDocument;
